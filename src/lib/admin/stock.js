export const STOCK_LEVELS = {
  OUT_OF_STOCK: 0,
  CRITICAL_MAX: 3,
  LOW_MAX: 5,
}

export const STOCK_STATUS = {
  OUT: 'out',
  CRITICAL: 'critical',
  LOW: 'low',
  NORMAL: 'normal',
}

export const STOCK_STATUS_LABEL = {
  out: 'Esgotado',
  critical: 'Estoque crítico',
  low: 'Estoque baixo',
  normal: 'Normal',
}

export function classifyStock(stock) {
  const n = Number(stock)
  if (!Number.isFinite(n) || n <= STOCK_LEVELS.OUT_OF_STOCK) {
    return STOCK_STATUS.OUT
  }
  if (n <= STOCK_LEVELS.CRITICAL_MAX) return STOCK_STATUS.CRITICAL
  if (n <= STOCK_LEVELS.LOW_MAX) return STOCK_STATUS.LOW
  return STOCK_STATUS.NORMAL
}

export function isAlertStock(stock) {
  return classifyStock(stock) !== STOCK_STATUS.NORMAL
}

export function summarizeVariantStock(variants = []) {
  const stocks = (variants || []).map((item) => Number(item?.stock) || 0)
  if (!stocks.length) {
    return { totalStock: 0, worstStock: 0, hasAlertVariant: true }
  }
  return {
    totalStock: stocks.reduce((sum, value) => sum + value, 0),
    worstStock: Math.min(...stocks),
    hasAlertVariant: stocks.some((value) => isAlertStock(value)),
  }
}

export function formatVariantLabel(item) {
  return [item?.color, item?.size].filter(Boolean).join(' • ')
}

export function filterStockAlerts(alerts = [], { query = '', filter = 'all' } = {}) {
  const q = String(query || '').trim().toLowerCase()
  return alerts.filter((item) => {
    if (filter === 'out' && item.status !== STOCK_STATUS.OUT) return false
    if (filter === 'critical' && item.status !== STOCK_STATUS.CRITICAL) return false
    if (filter === 'low' && item.status !== STOCK_STATUS.LOW) return false
    if (!q) return true
    const haystack = [item.productName, item.size, item.color, item.sku]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

function compareAlerts(a, b) {
  const order = { out: 0, critical: 1, low: 2 }
  const statusCmp = (order[a.status] ?? 9) - (order[b.status] ?? 9)
  if (statusCmp !== 0) return statusCmp
  const nameCmp = String(a.productName || '').localeCompare(
    String(b.productName || ''),
    'pt-BR',
  )
  if (nameCmp !== 0) return nameCmp
  return (Number(a.stock) || 0) - (Number(b.stock) || 0)
}

export function buildStockAlertState(rows = []) {
  const alerts = []

  for (const row of rows) {
    if (!row || row.active === false) continue
    if (row.product?.active === false) {
      // Still surface inactive catalog items — the owner needs to restock them.
    }
    const status = classifyStock(row.stock)
    if (status === STOCK_STATUS.NORMAL) continue

    alerts.push({
      id: row.id,
      productId: row.product_id || row.product?.id || null,
      productName: row.product?.name || 'Produto',
      productSlug: row.product?.slug || '',
      productActive: row.product?.active !== false,
      size: row.size || '',
      color: row.color || '',
      sku: row.sku || '',
      stock: Math.max(0, Number(row.stock) || 0),
      status,
      label: STOCK_STATUS_LABEL[status],
    })
  }

  alerts.sort(compareAlerts)

  const grouped = {
    out: alerts.filter((item) => item.status === STOCK_STATUS.OUT),
    critical: alerts.filter((item) => item.status === STOCK_STATUS.CRITICAL),
    low: alerts.filter((item) => item.status === STOCK_STATUS.LOW),
  }

  const summary = {
    out: grouped.out.length,
    critical: grouped.critical.length,
    low: grouped.low.length,
    total: alerts.length,
  }

  return { alerts, grouped, summary }
}
