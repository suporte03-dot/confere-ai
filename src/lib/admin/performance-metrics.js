import { dayKey, isDateInRange } from './performance-period.js'

/** Confirmed sale: payment confirmed and order not cancelled/expired. */
export function isConfirmedSale(order) {
  if (!order) return false
  if (order.payment_status !== 'paid') return false
  if (order.order_status === 'cancelled' || order.order_status === 'expired') return false
  return true
}

export function orderInPeriod(order, range) {
  return isDateInRange(order?.created_at, range)
}

/**
 * Prefer paid_at for revenue timing when present; fall back to created_at.
 */
export function saleTimestamp(order) {
  if (!order) return null
  if (order.paid_at) return order.paid_at
  return order.created_at || null
}

export function confirmedSaleInPeriod(order, range) {
  if (!isConfirmedSale(order)) return false
  return isDateInRange(saleTimestamp(order), range)
}

export function percentChange(current, previous) {
  const cur = Number(current) || 0
  const prev = Number(previous) || 0
  if (prev === 0) {
    if (cur === 0) {
      return { pct: null, label: 'Sem período anterior para comparação', direction: 'flat' }
    }
    return { pct: null, label: 'Sem período anterior para comparação', direction: 'up' }
  }
  const pct = ((cur - prev) / prev) * 100
  const rounded = Math.round(pct * 10) / 10
  const direction = rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'flat'
  const sign = rounded > 0 ? '+' : ''
  return {
    pct: rounded,
    label: `${sign}${rounded.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`,
    direction,
  }
}

export function computeOrderKpis(orders, range) {
  const inPeriod = (orders || []).filter((order) => orderInPeriod(order, range))
  // Paid sales timed by paid_at (fallback created_at) even if created earlier
  const paidBySaleDate = (orders || []).filter((order) => confirmedSaleInPeriod(order, range))

  const revenue = paidBySaleDate.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
  const paidCount = paidBySaleDate.length
  const orderCount = inPeriod.length
  const ticketAverage = paidCount > 0 ? revenue / paidCount : 0

  const byStatus = {
    pending_payment: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    expired: 0,
  }
  for (const order of inPeriod) {
    const key = order.order_status
    if (key in byStatus) byStatus[key] += 1
  }

  return {
    orderCount,
    paidCount,
    revenue,
    ticketAverage,
    byStatus,
    paidOrders: paidBySaleDate,
    periodOrders: inPeriod,
  }
}

export function computeItemsSold(items = [], paidOrderIdSet) {
  let units = 0
  for (const item of items) {
    if (!paidOrderIdSet.has(item.order_id)) continue
    units += Math.max(0, Number(item.quantity) || 0)
  }
  return units
}

export function aggregateTopProducts(items = [], paidOrderIdSet, { limit = 5 } = {}) {
  const map = new Map()

  for (const item of items) {
    if (!paidOrderIdSet.has(item.order_id)) continue
    const qty = Math.max(0, Number(item.quantity) || 0)
    const revenue = Number(item.line_total)
    const safeRevenue = Number.isFinite(revenue)
      ? revenue
      : qty * (Number(item.unit_price) || 0)
    const key = [
      item.product_id || item.product_name || 'unknown',
      item.variant_id || item.variant_label || '',
    ].join('::')

    const current = map.get(key) || {
      key,
      productId: item.product_id || null,
      productName: item.product_name || 'Produto',
      variantLabel: item.variant_label || '',
      quantity: 0,
      revenue: 0,
    }
    current.quantity += qty
    current.revenue += safeRevenue
    map.set(key, current)
  }

  return [...map.values()]
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, limit)
}

export function aggregateByTaxonomy(items = [], paidOrderIdSet, productMeta, field) {
  const map = new Map()
  let totalRevenue = 0

  for (const item of items) {
    if (!paidOrderIdSet.has(item.order_id)) continue
    const qty = Math.max(0, Number(item.quantity) || 0)
    const revenue = Number(item.line_total)
    const safeRevenue = Number.isFinite(revenue)
      ? revenue
      : qty * (Number(item.unit_price) || 0)
    totalRevenue += safeRevenue

    const meta = item.product_id ? productMeta.get(item.product_id) : null
    const name = meta?.[field] || null
    if (!name) continue

    const current = map.get(name) || { name, quantity: 0, revenue: 0 }
    current.quantity += qty
    current.revenue += safeRevenue
    map.set(name, current)
  }

  return [...map.values()]
    .map((row) => ({
      ...row,
      share: totalRevenue > 0 ? (row.revenue / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

export function buildDailySeries(orders, range, { mode = 'revenue' } = {}) {
  if (!range?.start || !range?.end) return []

  const buckets = new Map()
  const cursor = new Date(range.start)
  cursor.setHours(0, 0, 0, 0)
  const end = new Date(range.end)
  end.setHours(0, 0, 0, 0)

  while (cursor.getTime() <= end.getTime()) {
    const key = dayKey(cursor)
    buckets.set(key, { date: key, revenue: 0, orders: 0 })
    cursor.setDate(cursor.getDate() + 1)
  }

  for (const order of orders || []) {
    if (!confirmedSaleInPeriod(order, range)) continue
    const key = dayKey(saleTimestamp(order))
    if (!key || !buckets.has(key)) continue
    const bucket = buckets.get(key)
    bucket.orders += 1
    bucket.revenue += Number(order.total) || 0
  }

  return [...buckets.values()].map((bucket) => ({
    ...bucket,
    value: mode === 'orders' ? bucket.orders : bucket.revenue,
  }))
}

export function buildComparison(currentKpis, previousKpis) {
  return {
    revenue: percentChange(currentKpis.revenue, previousKpis.revenue),
    orders: percentChange(currentKpis.orderCount, previousKpis.orderCount),
    ticket: percentChange(currentKpis.ticketAverage, previousKpis.ticketAverage),
    items: percentChange(currentKpis.itemsSold || 0, previousKpis.itemsSold || 0),
  }
}
