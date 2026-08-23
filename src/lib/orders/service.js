import { createClient } from '../supabase/server'
import { createPublicClient } from '../supabase/public'
import { friendlyError } from '../admin/format'

function mapRpcError(result, fallback) {
  if (!result) return fallback
  if (result.ok === false) return result.error || fallback
  return null
}

export async function placeGuestOrder(payload) {
  const supabase = await createClient()
  // Expire stale reservations lazily before creating a new order
  await supabase.rpc('release_expired_reservations')

  const { data, error } = await supabase.rpc('place_guest_order', { payload })
  if (error) {
    return { ok: false, error: friendlyError(error, 'Não foi possível criar o pedido.') }
  }
  const err = mapRpcError(data, 'Não foi possível criar o pedido.')
  if (err) return { ok: false, error: err }
  return {
    ok: true,
    orderId: data.order_id,
    orderNumber: data.order_number,
    publicToken: data.public_token,
    total: Number(data.total) || 0,
    reservedUntil: data.reserved_until,
  }
}

export async function fetchOrderByPublicToken(token) {
  const supabase = createPublicClient()
  await supabase.rpc('release_expired_reservations')
  const { data, error } = await supabase.rpc('get_order_by_public_token', {
    p_token: token,
  })
  if (error) {
    return { ok: false, error: friendlyError(error, 'Pedido não encontrado.') }
  }
  if (!data?.ok) {
    return { ok: false, error: data?.error || 'Pedido não encontrado.' }
  }
  return { ok: true, order: data.order }
}

export async function fetchOrdersForAdmin({ status = null, q = '' } = {}) {
  const supabase = await createClient()
  await supabase.rpc('release_expired_reservations')

  let query = supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      order_status,
      payment_status,
      total,
      reserved_until,
      paid_at,
      created_at,
      updated_at
    `,
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (status && status !== 'all') {
    query = query.eq('order_status', status)
  }

  const { data, error } = await query
  if (error) throw error

  const term = String(q || '').trim().toLowerCase()
  const rows = data || []
  if (!term) return rows

  return rows.filter((row) => {
    const hay = [
      row.order_number,
      row.customer_name,
      row.customer_email,
      row.customer_phone,
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(term)
  })
}

export async function fetchOrderDetailForAdmin(orderId) {
  const supabase = await createClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (error) throw error
  if (!order) return null

  const [{ data: items }, { data: history }] = await Promise.all([
    supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
    supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
  ])

  return {
    ...order,
    items: items || [],
    history: history || [],
  }
}

export async function confirmOrderPayment(orderId) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_confirm_order_payment', {
    p_order_id: orderId,
  })
  if (error) {
    return { ok: false, error: friendlyError(error, 'Não foi possível confirmar o pagamento.') }
  }
  if (!data?.ok) return { ok: false, error: data?.error || 'Não foi possível confirmar.' }
  return { ok: true }
}

export async function transitionOrderStatus(orderId, nextStatus) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_transition_order_status', {
    p_order_id: orderId,
    p_next: nextStatus,
  })
  if (error) {
    return { ok: false, error: friendlyError(error, 'Não foi possível atualizar o status.') }
  }
  if (!data?.ok) return { ok: false, error: data?.error || 'Transição inválida.' }
  return { ok: true }
}

export async function fetchOrderDashboardStats() {
  const supabase = await createClient()
  await supabase.rpc('release_expired_reservations')

  const { data, error } = await supabase
    .from('orders')
    .select('order_status, payment_status, total')
    .limit(2000)

  if (error) throw error

  const rows = data || []
  const countBy = (pred) => rows.filter(pred).length
  const sumPaid = rows
    .filter((r) => r.payment_status === 'paid')
    .reduce((sum, r) => sum + (Number(r.total) || 0), 0)

  return {
    pendingPayment: countBy((r) => r.order_status === 'pending_payment'),
    paid: countBy((r) => r.order_status === 'paid'),
    processing: countBy((r) => r.order_status === 'processing'),
    shipped: countBy((r) => r.order_status === 'shipped'),
    delivered: countBy((r) => r.order_status === 'delivered'),
    confirmedSalesTotal: sumPaid,
  }
}
