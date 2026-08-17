import { createPublicClient } from '../supabase/public'
import { adaptCategory, adaptCollection, adaptProduct } from './adapt'

const PRODUCT_LIST_SELECT = `
  id,
  name,
  slug,
  description,
  price,
  compare_at_price,
  active,
  featured,
  sku,
  sort_order,
  created_at,
  category:categories ( id, name, slug, active ),
  collection:collections ( id, name, slug, active, featured ),
  product_images ( id, storage_path, is_cover, position, alt_text ),
  product_variants ( id, size, color, stock, sku )
`

const PRODUCT_DETAIL_SELECT = PRODUCT_LIST_SELECT

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value) {
  return UUID_RE.test(String(value || ''))
}

function getClientSafe() {
  try {
    return createPublicClient()
  } catch (error) {
    console.error('[catalog] Supabase env unavailable:', error?.message || error)
    return null
  }
}

function isTaxonomyVisible(node) {
  if (!node) return true
  return node.active !== false
}

function filterVisibleProducts(rows = []) {
  return rows.filter((row) => {
    if (!row?.active) return false
    if (!isTaxonomyVisible(row.category)) return false
    if (row.collection && !isTaxonomyVisible(row.collection)) return false
    return true
  })
}

async function fetchActiveProductRows(supabase, applyFilters = (q) => q) {
  const base = () =>
    applyFilters(
      supabase.from('products').select(PRODUCT_LIST_SELECT).eq('active', true),
    )

  const withSort = await base()
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (!withSort.error) return withSort.data || []

  // Older schemas may omit products.sort_order — fall back to name only.
  if (/sort_order/i.test(withSort.error.message || '')) {
    const fallback = await base().order('name', { ascending: true })
    if (fallback.error) {
      console.error('[catalog] products query:', fallback.error.message)
      return []
    }
    return fallback.data || []
  }

  console.error('[catalog] products query:', withSort.error.message)
  return []
}


/**
 * Active products for the public storefront.
 * Cover image resolved in adapter (is_cover, else first by position).
 */
export async function listActiveProducts() {
  const supabase = getClientSafe()
  if (!supabase) return []

  const rows = await fetchActiveProductRows(supabase)
  return filterVisibleProducts(rows).map((row) => adaptProduct(row))
}

export async function listActiveCategories() {
  const supabase = getClientSafe()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, active, sort_order')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('[catalog] listActiveCategories:', error.message)
    return []
  }

  return (data || []).map(adaptCategory)
}

export async function listActiveCollections() {
  const supabase = getClientSafe()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('collections')
    .select('id, name, slug, description, active, featured, sort_order')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('[catalog] listActiveCollections:', error.message)
    return []
  }

  return (data || []).map((row) => adaptCollection(row))
}

export async function getProductBySlug(slug) {
  if (!slug) return null
  const supabase = getClientSafe()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error('[catalog] getProductBySlug:', error.message)
    return null
  }
  if (!data || !isTaxonomyVisible(data.category)) return null
  if (data.collection && !isTaxonomyVisible(data.collection)) return null

  return adaptProduct(data, { detail: true })
}

export async function getProductById(id) {
  if (!id) return null
  const supabase = getClientSafe()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('id', id)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error('[catalog] getProductById:', error.message)
    return null
  }
  if (!data || !isTaxonomyVisible(data.category)) return null
  if (data.collection && !isTaxonomyVisible(data.collection)) return null

  return adaptProduct(data, { detail: true })
}

/** Resolve by slug first; fall back to UUID id (legacy links). */
export async function getProductBySlugOrId(param) {
  const key = String(param || '').trim()
  if (!key) return null

  const bySlug = await getProductBySlug(key)
  if (bySlug) return bySlug

  if (isUuid(key)) {
    return getProductById(key)
  }

  return null
}

export async function getCollectionBySlug(slug) {
  if (!slug) return null
  const supabase = getClientSafe()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('collections')
    .select('id, name, slug, description, active, featured, sort_order')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error('[catalog] getCollectionBySlug:', error.message)
    return null
  }
  if (!data) return null

  const productRows = await fetchActiveProductRows(supabase, (q) =>
    q.eq('collection_id', data.id),
  )
  const products = filterVisibleProducts(productRows).map((row) => adaptProduct(row))
  return adaptCollection(data, { products })
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null
  const categories = await listActiveCategories()
  return categories.find((c) => c.slug === slug) || null
}

export async function listProductsByCategorySlug(slug) {
  if (!slug) return listActiveProducts()
  const products = await listActiveProducts()
  return products.filter((p) => p.category === slug || p.categorySlug === slug)
}

export function productParamIsUuid(param) {
  return isUuid(param)
}

/** Home highlight: first featured active collection, else first active. */
export async function getFeaturedCollection() {
  const collections = await listActiveCollections()
  return collections.find((c) => c.featured) || collections[0] || null
}
