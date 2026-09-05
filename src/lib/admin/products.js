import { createClient } from '../supabase/server'
import { getAdminAccess } from '../supabase/admin-auth'
import { productImagePublicUrl } from './format'
import { summarizeVariantStock } from './stock'

const PRODUCT_LIST_SELECT = `
  id,
  name,
  slug,
  price,
  compare_at_price,
  active,
  featured,
  sku,
  updated_at,
  category:categories ( id, name ),
  collection:collections ( id, name ),
  product_images ( id, storage_path, is_cover, position ),
  product_variants ( id, stock )
`

const PRODUCT_DETAIL_SELECT = `
  id,
  name,
  slug,
  description,
  price,
  compare_at_price,
  category_id,
  collection_id,
  active,
  featured,
  sku,
  created_at,
  updated_at,
  category:categories ( id, name ),
  collection:collections ( id, name ),
  product_images ( id, storage_path, is_cover, position, alt_text, created_at ),
  product_variants ( id, size, color, stock, sku, created_at, updated_at )
`

export async function assertAdminAccess() {
  const access = await getAdminAccess()
  if (!access.user) {
    return { ok: false, reason: 'unauthenticated', access }
  }
  if (!access.allowed) {
    return { ok: false, reason: 'forbidden', access }
  }
  return { ok: true, access }
}

export async function fetchProductsForAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_LIST_SELECT)
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data || []).map((row) => {
    const images = [...(row.product_images || [])].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    )
    const cover =
      images.find((img) => img.is_cover) || images[0] || null
    const { totalStock, worstStock, hasAlertVariant } = summarizeVariantStock(
      row.product_variants,
    )

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: row.price,
      compareAtPrice: row.compare_at_price,
      active: Boolean(row.active),
      featured: Boolean(row.featured),
      sku: row.sku,
      updatedAt: row.updated_at,
      categoryName: row.category?.name || '—',
      collectionName: row.collection?.name || '—',
      totalStock,
      worstStock,
      hasAlertVariant,
      coverUrl: cover ? productImagePublicUrl(cover.storage_path) : null,
    }
  })
}

export async function fetchProductById(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const images = [...(data.product_images || [])]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((img) => ({
      ...img,
      publicUrl: productImagePublicUrl(img.storage_path),
    }))

  const variants = [...(data.product_variants || [])].sort((a, b) => {
    const sizeCmp = String(a.size || '').localeCompare(String(b.size || ''), 'pt-BR')
    if (sizeCmp !== 0) return sizeCmp
    return String(a.color || '').localeCompare(String(b.color || ''), 'pt-BR')
  })

  return {
    ...data,
    product_images: images,
    product_variants: variants,
  }
}

export async function fetchActiveTaxonomies() {
  const supabase = await createClient()

  const [categoriesRes, collectionsRes] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, parent_id, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    supabase
      .from('collections')
      .select('id, name, slug, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  let categoriesData = categoriesRes.data
  let categoriesError = categoriesRes.error
  if (
    categoriesError &&
    /parent_id/i.test(String(categoriesError.message || categoriesError.details || ''))
  ) {
    const fallback = await supabase
      .from('categories')
      .select('id, name, slug, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    categoriesData = fallback.data
    categoriesError = fallback.error
  }

  if (categoriesError) throw categoriesError
  if (collectionsRes.error) throw collectionsRes.error

  const categories = (categoriesData || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    parentId: row.parent_id || null,
    sortOrder: Number(row.sort_order) || 0,
  }))

  const collections = (collectionsRes.data || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    sortOrder: Number(row.sort_order) || 0,
  }))

  return {
    categories,
    collections,
  }
}

export async function isSlugAvailable(slug, excludeId = null) {
  const supabase = await createClient()
  let query = supabase.from('products').select('id').eq('slug', slug).limit(1)
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query
  if (error) throw error
  return !data?.length
}
