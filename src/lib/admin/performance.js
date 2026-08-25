import { createClient } from '../supabase/server'
import { fetchStoreSettings } from '../store/settings'
import { productImagePublicUrl } from './format'
import {
  STOCK_LEVELS,
  STOCK_STATUS,
  STOCK_STATUS_LABEL,
  classifyStock,
  formatVariantLabel,
} from './stock'
import {
  DEFAULT_PERIOD,
  normalizePeriodKey,
  periodLabel,
  previousPeriodRange,
  resolvePeriodRange,
  toDateInputValue,
} from './performance-period'
import {
  aggregateByTaxonomy,
  aggregateTopProducts,
  buildComparison,
  buildDailySeries,
  computeItemsSold,
  computeOrderKpis,
  confirmedSaleInPeriod,
  isConfirmedSale,
} from './performance-metrics'

const ORDER_SELECT = `
  id,
  order_number,
  customer_name,
  order_status,
  payment_status,
  total,
  paid_at,
  created_at
`

const ITEM_SELECT = `
  order_id,
  product_id,
  variant_id,
  product_name,
  variant_label,
  quantity,
  unit_price,
  line_total
`

const PRODUCT_META_SELECT = `
  id,
  name,
  category:categories ( id, name ),
  collection:collections ( id, name ),
  product_images ( id, storage_path, is_cover, position )
`

function emptyKpis() {
  return {
    orderCount: 0,
    paidCount: 0,
    revenue: 0,
    ticketAverage: 0,
    itemsSold: 0,
    byStatus: {
      pending_payment: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      expired: 0,
    },
  }
}

function chunk(list, size = 100) {
  const out = []
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size))
  }
  return out
}

async function fetchOrdersBetween(supabase, start, end) {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())
    .order('created_at', { ascending: false })
    .limit(5000)

  if (error) throw error
  return data || []
}

/**
 * Paid orders may have been created before the range but paid inside it.
 * Also pull payment-dated sales via paid_at overlap.
 */
async function fetchPaidOrdersByPaidAt(supabase, start, end) {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('payment_status', 'paid')
    .gte('paid_at', start.toISOString())
    .lte('paid_at', end.toISOString())
    .order('paid_at', { ascending: false })
    .limit(5000)

  if (error) throw error
  return (data || []).filter(isConfirmedSale)
}

function mergeOrdersById(...lists) {
  const map = new Map()
  for (const list of lists) {
    for (const order of list || []) {
      if (order?.id) map.set(order.id, order)
    }
  }
  return [...map.values()]
}

async function fetchItemsForOrders(supabase, orderIds) {
  if (!orderIds.length) return []
  const rows = []
  for (const ids of chunk(orderIds, 100)) {
    const { data, error } = await supabase
      .from('order_items')
      .select(ITEM_SELECT)
      .in('order_id', ids)
    if (error) throw error
    rows.push(...(data || []))
  }
  return rows
}

async function fetchProductMeta(supabase, productIds) {
  const map = new Map()
  const unique = [...new Set(productIds.filter(Boolean))]
  if (!unique.length) return map

  for (const ids of chunk(unique, 100)) {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_META_SELECT)
      .in('id', ids)
    if (error) throw error
    for (const row of data || []) {
      const images = [...(row.product_images || [])].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
      )
      const cover = images.find((img) => img.is_cover) || images[0] || null
      map.set(row.id, {
        name: row.name,
        categoryName: row.category?.name || null,
        collectionName: row.collection?.name || null,
        coverUrl: cover ? productImagePublicUrl(cover.storage_path) : null,
      })
    }
  }
  return map
}

async function fetchStockAttention(supabase, threshold) {
  const lowMax = Math.max(0, Number(threshold) || STOCK_LEVELS.LOW_MAX)
  const { data, error } = await supabase
    .from('product_variants')
    .select(
      `
      id,
      size,
      color,
      stock,
      sku,
      active,
      product_id,
      product:products ( id, name, slug, active )
    `,
    )
    .lte('stock', lowMax)
    .order('stock', { ascending: true })
    .limit(200)

  if (error) throw error

  const lowStock = []
  let outOfStock = 0

  for (const row of data || []) {
    if (!row || row.active === false) continue
    const stock = Math.max(0, Number(row.stock) || 0)
    const status = classifyStock(stock, { lowMax })
    if (status === STOCK_STATUS.NORMAL) continue
    if (status === STOCK_STATUS.OUT) outOfStock += 1
    lowStock.push({
      id: row.id,
      productId: row.product_id || row.product?.id || null,
      productName: row.product?.name || 'Produto',
      variantLabel: formatVariantLabel(row) || row.sku || '—',
      stock,
      status,
      label: STOCK_STATUS_LABEL[status],
    })
  }

  return {
    lowStock: lowStock.slice(0, 8),
    outOfStockCount: outOfStock,
    threshold: lowMax,
  }
}

function enrichTopProducts(rows, productMeta) {
  return rows.map((row) => {
    const meta = row.productId ? productMeta.get(row.productId) : null
    return {
      ...row,
      coverUrl: meta?.coverUrl || null,
      categoryName: meta?.categoryName || null,
    }
  })
}

function buildKpisForRange(allOrders, items, range) {
  const base = computeOrderKpis(allOrders, range)
  const paidIds = new Set(base.paidOrders.map((order) => order.id))
  const itemsSold = computeItemsSold(items, paidIds)
  return {
    orderCount: base.orderCount,
    paidCount: base.paidCount,
    revenue: base.revenue,
    ticketAverage: base.ticketAverage,
    itemsSold,
    byStatus: base.byStatus,
    paidOrderIds: [...paidIds],
    periodOrders: base.periodOrders,
    paidOrders: base.paidOrders,
  }
}

export async function fetchPerformanceDashboard(search = {}) {
  const periodKey = normalizePeriodKey(search.periodo || search.period || DEFAULT_PERIOD)
  const now = new Date()
  const range = resolvePeriodRange({
    periodKey,
    from: search.de || search.from,
    to: search.ate || search.to,
    now,
  })
  const previous = previousPeriodRange(range)
  const todayRange = resolvePeriodRange({ periodKey: 'today', now })

  const supabase = await createClient()
  await supabase.rpc('release_expired_reservations')

  const earliest = new Date(
    Math.min(
      range.start.getTime(),
      previous?.start?.getTime() || range.start.getTime(),
      todayRange.start.getTime(),
    ),
  )
  // Widen fetch window slightly for paid_at-only sales created earlier
  const fetchStart = new Date(earliest)
  fetchStart.setDate(fetchStart.getDate() - 60)

  const latest = new Date(
    Math.max(range.end.getTime(), todayRange.end.getTime(), previous?.end?.getTime() || 0),
  )

  const settings = await fetchStoreSettings()
  const threshold = settings.low_stock_threshold ?? STOCK_LEVELS.LOW_MAX

  const [createdOrders, paidInRange, paidToday, paidPrevious, stock] = await Promise.all([
    fetchOrdersBetween(supabase, fetchStart, latest),
    fetchPaidOrdersByPaidAt(supabase, range.start, range.end),
    fetchPaidOrdersByPaidAt(supabase, todayRange.start, todayRange.end),
    previous
      ? fetchPaidOrdersByPaidAt(supabase, previous.start, previous.end)
      : Promise.resolve([]),
    fetchStockAttention(supabase, threshold),
  ])

  const allOrders = mergeOrdersById(createdOrders, paidInRange, paidToday, paidPrevious)

  // Items for all confirmed sales that may appear in current / previous / today
  const saleOrderIds = [
    ...new Set(
      allOrders.filter((order) => isConfirmedSale(order)).map((order) => order.id),
    ),
  ]
  const items = await fetchItemsForOrders(supabase, saleOrderIds)

  const current = buildKpisForRange(allOrders, items, range)
  const previousKpis = previous
    ? buildKpisForRange(allOrders, items, previous)
    : { ...emptyKpis(), paidOrderIds: [], periodOrders: [], paidOrders: [] }
  const today = buildKpisForRange(allOrders, items, todayRange)

  const paidIdSet = new Set(current.paidOrderIds)
  const productIds = items
    .filter((item) => paidIdSet.has(item.order_id) && item.product_id)
    .map((item) => item.product_id)
  const productMeta = await fetchProductMeta(supabase, productIds)

  const topLimit = search.top === 'all' ? 50 : 5
  const topProducts = enrichTopProducts(
    aggregateTopProducts(items, paidIdSet, { limit: topLimit }),
    productMeta,
  )

  const categories = aggregateByTaxonomy(items, paidIdSet, productMeta, 'categoryName')
  const collections = aggregateByTaxonomy(items, paidIdSet, productMeta, 'collectionName')

  const dailyRevenue = buildDailySeries(allOrders, range, { mode: 'revenue' })
  const dailyOrders = buildDailySeries(allOrders, range, { mode: 'orders' })

  const recentOrders = [...current.periodOrders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8)
    .map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name || 'Cliente',
      total: Number(order.total) || 0,
      status: order.order_status,
      createdAt: order.created_at,
    }))

  const comparison = buildComparison(current, previousKpis)

  return {
    ok: true,
    period: {
      key: range.key,
      label: periodLabel(range.key, range),
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      fromInput: toDateInputValue(range.start),
      toInput: toDateInputValue(range.end),
      previousLabel: previous
        ? `${toDateInputValue(previous.start)} — ${toDateInputValue(previous.end)}`
        : null,
    },
    kpis: {
      revenue: current.revenue,
      orderCount: current.orderCount,
      paidCount: current.paidCount,
      ticketAverage: current.ticketAverage,
      itemsSold: current.itemsSold,
    },
    comparison,
    byStatus: current.byStatus,
    dailyRevenue,
    dailyOrders,
    topProducts,
    topProductsTotal: aggregateTopProducts(items, paidIdSet, { limit: 500 }).length,
    categories,
    collections,
    recentOrders,
    today: {
      orderCount: today.orderCount,
      paidCount: today.paidCount,
      revenue: today.revenue,
      itemsSold: today.itemsSold,
    },
    stock,
  }
}

export function emptyPerformanceDashboard(search = {}) {
  const periodKey = normalizePeriodKey(search.periodo || DEFAULT_PERIOD)
  const range = resolvePeriodRange({
    periodKey,
    from: search.de,
    to: search.ate,
    now: new Date(),
  })
  return {
    ok: false,
    period: {
      key: range.key,
      label: periodLabel(range.key, range),
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      fromInput: toDateInputValue(range.start),
      toInput: toDateInputValue(range.end),
      previousLabel: null,
    },
    kpis: emptyKpis(),
    comparison: buildComparison(emptyKpis(), emptyKpis()),
    byStatus: emptyKpis().byStatus,
    dailyRevenue: [],
    dailyOrders: [],
    topProducts: [],
    topProductsTotal: 0,
    categories: [],
    collections: [],
    recentOrders: [],
    today: { orderCount: 0, paidCount: 0, revenue: 0, itemsSold: 0 },
    stock: { lowStock: [], outOfStockCount: 0, threshold: STOCK_LEVELS.LOW_MAX },
  }
}

/** Expose for unit tests that need sale-in-period filtering on merged lists. */
export { confirmedSaleInPeriod }
