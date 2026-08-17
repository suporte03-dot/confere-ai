import { createClient } from '../supabase/server'
import { STOCK_LEVELS, buildStockAlertState } from './stock'

const VARIANT_SELECT_WITH_ACTIVE = `
  id,
  size,
  color,
  stock,
  sku,
  active,
  product_id,
  product:products ( id, name, slug, active )
`

const VARIANT_SELECT_BASIC = `
  id,
  size,
  color,
  stock,
  sku,
  product_id,
  product:products ( id, name, slug, active )
`

const EMPTY_STATE = buildStockAlertState([])

async function queryAlertVariants(supabase, select) {
  return supabase
    .from('product_variants')
    .select(select)
    .lte('stock', STOCK_LEVELS.LOW_MAX)
    .order('stock', { ascending: true })
}

export async function fetchStockAlerts() {
  const supabase = await createClient()

  const primary = await queryAlertVariants(supabase, VARIANT_SELECT_WITH_ACTIVE)
  if (!primary.error) {
    return buildStockAlertState(primary.data || [])
  }

  if (/active/i.test(primary.error.message || '')) {
    const fallback = await queryAlertVariants(supabase, VARIANT_SELECT_BASIC)
    if (fallback.error) {
      console.error('[admin stock] variants query:', fallback.error.message)
      return EMPTY_STATE
    }
    return buildStockAlertState(fallback.data || [])
  }

  console.error('[admin stock] variants query:', primary.error.message)
  return EMPTY_STATE
}
