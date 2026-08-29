import { createClient } from '../supabase/server'
import { createPublicClient } from '../supabase/public'
import { friendlyError } from '../admin/format'
import { dispatchOrderCreatedEmails } from '../email/service'

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
  await dispatchOrderCreatedEmails({
    orderId: data.order_id,
    publicToken: data.public_token,
    phone: payload.customer?.phone || '',
  })
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

export async function fetchOrdersForAdmin({
  status = null,
  q = '',
  payment = 'all',
  period = 'all',
  dateFrom = '',
  dateTo = '',
  sort = 'newest',
} = {}) {
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
    .limit(200)

  if (status && status !== 'all') {
    query = query.eq('order_status', status)
  }
  if (payment && payment !== 'all') {
    query = query.eq('payment_status', payment)
  }
  const searchTerm = String(q || '').trim()
  if (searchTerm) {
    const safeSearchTerm = searchTerm
      .replace(/[^\p{L}\p{N}@+\- ]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (safeSearchTerm) {
      query = query.or(
        [
          `order_number.ilike.%${safeSearchTerm}%`,
          `customer_name.ilike.%${safeSearchTerm}%`,
          `customer_email.ilike.%${safeSearchTerm}%`,
          `customer_phone.ilike.%${safeSearchTerm}%`,
        ].join(','),
      )
    }
  }

  const range = resolveOrderDateRange(period, dateFrom, dateTo)
  if (range.from) query = query.gte('created_at', range.from)
  if (range.to) query = query.lt('created_at', range.to)

  if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true })
  } else if (sort === 'highest') {
    query = query.order('total', { ascending: false })
  } else if (sort === 'lowest') {
    query = query.order('total', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error

  const term = searchTerm.toLowerCase()
  const rows = data || []
  const filteredRows = term
    ? rows.filter((row) => {
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
    : rows

  if (!filteredRows.length) return filteredRows

  // Email telemetry is optional until the additive migration is applied.
  const { data: emailEvents, error: emailError } = await supabase
    .from('order_email_events')
    .select('id, order_id, event_type, recipient, status, sent_at, failed_at, error_code')
    .in('order_id', filteredRows.map((row) => row.id))

  if (emailError) return filteredRows

  return filteredRows.map((row) => ({
    ...row,
    email_events: (emailEvents || []).filter((event) => event.order_id === row.id),
  }))
}

function startOfLocalDay(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function resolveOrderDateRange(period, dateFrom, dateTo) {
  const now = new Date()
  let from = null
  let to = null

  if (period === 'today') {
    from = startOfLocalDay(now)
    to = new Date(from)
    to.setDate(to.getDate() + 1)
  } else if (period === '7d' || period === '30d') {
    from = startOfLocalDay(now)
    from.setDate(from.getDate() - (period === '7d' ? 6 : 29))
    to = now
  } else if (period === 'month') {
    from = new Date(now.getFullYear(), now.getMonth(), 1)
    to = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  } else if (period === 'custom' && dateFrom) {
    from = new Date(`${dateFrom}T00:00:00`)
    to = dateTo ? new Date(`${dateTo}T00:00:00`) : new Date(from)
    to.setDate(to.getDate() + 1)
  }

  return {
    from: from && !Number.isNaN(from.getTime()) ? from.toISOString() : null,
    to: to && !Number.isNaN(to.getTime()) ? to.toISOString() : null,
  }
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

  const [{ data: items }, { data: history }, { data: emailEvents, error: emailError }] =
    await Promise.all([
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
    supabase
      .from('order_email_events')
      .select('id, order_id, event_type, recipient, status, sent_at, failed_at, error_code')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
  ])

  return {
    ...order,
    items: items || [],
    history: history || [],
    emailEvents: emailError ? [] : emailEvents || [],
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

  const statuses = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered']
  const countResults = await Promise.all(
    statuses.map((status) =>
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('order_status', status),
    ),
  )
  const countError = countResults.find((result) => result.error)?.error
  if (countError) throw countError

  const { data: paidRows, error: paidError } = await supabase
    .from('orders')
    .select('total')
    .eq('payment_status', 'paid')
  if (paidError) throw paidError

  const countByStatus = Object.fromEntries(
    statuses.map((status, index) => [status, countResults[index].count || 0]),
  )
  const sumPaid = (paidRows || []).reduce((sum, row) => sum + (Number(row.total) || 0), 0)

  return {
    pendingPayment: countByStatus.pending_payment,
    paid: countByStatus.paid,
    processing: countByStatus.processing,
    shipped: countByStatus.shipped,
    delivered: countByStatus.delivered,
    confirmedSalesTotal: sumPaid,
  }
}
