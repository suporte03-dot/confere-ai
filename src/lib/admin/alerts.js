import { createClient } from '../supabase/server'
import { fetchStockAlerts } from './stock-alerts'
import { formatVariantLabel } from './stock'

const EMPTY_STOCK = {
  alerts: [],
  grouped: { out: [], critical: [], low: [] },
  summary: { out: 0, critical: 0, low: 0, total: 0 },
}

const ORDER_EVENT_LABELS = {
  pending_payment: 'Novo pedido recebido',
  paid: 'Pagamento confirmado',
  processing: 'Pedido em preparação',
  shipped: 'Pedido enviado',
  delivered: 'Pedido entregue',
  cancelled: 'Pedido cancelado',
}

const ORDER_EVENT_TONES = {
  pending_payment: 'gold',
  paid: 'success',
  processing: 'gold',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
}

function orderEvent(order, status, date, idSuffix = status) {
  return {
    id: `order:${order.id}:${idSuffix}`,
    kind: 'order',
    tone: ORDER_EVENT_TONES[status] || 'gold',
    title: ORDER_EVENT_LABELS[status] || 'Atualização de pedido',
    detail: `${order.order_number} · ${order.customer_name}`,
    date,
    href: `/admin/pedidos/${order.id}`,
  }
}

function emailEvent(event, order) {
  const label = ORDER_EVENT_LABELS[event.event_type] || 'Atualização do pedido'
  return {
    id: `email:${event.id}`,
    kind: 'email',
    tone: 'danger',
    title: `Falha no e-mail · ${label}`,
    detail: order ? `${order.order_number} · ${event.recipient}` : event.recipient,
    date: event.failed_at || event.updated_at || event.created_at,
    href: order ? `/admin/pedidos/${order.id}` : '/admin/pedidos',
  }
}

function stockEvent(item) {
  const units = item.stock === 0
    ? 'Sem unidades disponíveis'
    : `${item.stock} unidade${item.stock === 1 ? '' : 's'} disponível${item.stock === 1 ? '' : 'eis'}`
  return {
    id: `stock:${item.id}:${item.status}`,
    kind: 'stock',
    tone: item.status === 'out' ? 'danger' : item.status === 'critical' ? 'warning' : 'gold',
    title: item.status === 'out' ? 'Estoque esgotado' : item.label,
    detail: [item.productName, formatVariantLabel(item), units].filter(Boolean).join(' · '),
    date: null,
    href: item.productId
      ? `/admin/produtos/${item.productId}?variante=${item.id}`
      : '/admin/estoque',
  }
}

function sortAlerts(alerts) {
  return alerts.sort((a, b) => {
    if (a.kind === 'stock' && b.kind !== 'stock') return 1
    if (a.kind !== 'stock' && b.kind === 'stock') return -1
    const aTime = a.date ? new Date(a.date).getTime() : 0
    const bTime = b.date ? new Date(b.date).getTime() : 0
    return bTime - aTime
  })
}

export async function fetchAdminAlerts() {
  let stock = EMPTY_STOCK
  try {
    const result = await fetchStockAlerts()
    if (result.ok) stock = result
  } catch {
    // The orders center remains useful if catalog reads fail.
  }

  const supabase = await createClient()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const [{ data: attentionOrders }, { data: history }, { data: emailEvents }] = await Promise.all([
    supabase
      .from('orders')
      .select('id, order_number, customer_name, order_status, payment_status, created_at, updated_at')
      .in('order_status', ['pending_payment', 'paid'])
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('order_status_history')
      .select('id, order_id, to_order_status, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(60),
    supabase
      .from('order_email_events')
      .select('id, order_id, event_type, recipient, status, failed_at, updated_at, created_at')
      .eq('status', 'failed')
      .order('failed_at', { ascending: false })
      .limit(30),
  ])

  const orders = attentionOrders || []
  const orderMap = new Map(orders.map((order) => [order.id, order]))
  const historyOrderIds = [...new Set((history || []).map((entry) => entry.order_id))]
  if (historyOrderIds.length) {
    const { data: historyOrders } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, order_status, payment_status, created_at, updated_at')
      .in('id', historyOrderIds)
    for (const order of historyOrders || []) orderMap.set(order.id, order)
  }

  const alerts = [
    ...stock.alerts.map(stockEvent),
    ...orders.map((order) => orderEvent(order, order.order_status, order.created_at)),
    ...(history || [])
      .map((entry) => {
        const order = orderMap.get(entry.order_id)
        return order && ORDER_EVENT_LABELS[entry.to_order_status]
          ? orderEvent(order, entry.to_order_status, entry.created_at)
          : null
      })
      .filter(Boolean),
    ...(emailEvents || []).map((event) => emailEvent(event, orderMap.get(event.order_id))),
  ]

  const uniqueAlerts = [...new Map(alerts.map((alert) => [alert.id, alert])).values()]
  return {
    ok: true,
    alerts: stock.alerts,
    grouped: stock.grouped,
    summary: stock.summary,
    notifications: sortAlerts(uniqueAlerts).slice(0, 80),
    alertCount: uniqueAlerts.length,
  }
}
