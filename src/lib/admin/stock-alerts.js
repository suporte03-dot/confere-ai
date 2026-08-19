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
const LOAD_ERROR = 'Não foi possível carregar o estoque. Tente novamente.'

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
    return { ok: true, ...buildStockAlertState(primary.data || []) }
  }

  if (/active/i.test(primary.error.message || '')) {
    const fallback = await queryAlertVariants(supabase, VARIANT_SELECT_BASIC)
    if (fallback.error) {
      return { ok: false, error: LOAD_ERROR, ...EMPTY_STATE }
    }
    return { ok: true, ...buildStockAlertState(fallback.data || []) }
  }

  return { ok: false, error: LOAD_ERROR, ...EMPTY_STATE }
}
