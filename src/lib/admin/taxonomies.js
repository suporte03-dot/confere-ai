import { createClient } from '../supabase/server'
import {
  buildCategorySelectGroups,
  buildCategoryTree,
  flattenCategoryTree,
} from './category-tree'

const CATEGORY_SELECT =
  'id, name, slug, description, active, sort_order, parent_id, created_at, updated_at'
const COLLECTION_SELECT =
  'id, name, slug, description, active, featured, sort_order, created_at, updated_at'

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order) || 0,
    parentId: row.parent_id || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapCollection(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    active: Boolean(row.active),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function fetchCategoriesForAdmin() {
  const supabase = await createClient()
  let { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  // Compatibilidade temporária se a migration parent_id ainda não foi aplicada.
  if (error && /parent_id/i.test(String(error.message || error.details || ''))) {
    const fallback = await supabase
      .from('categories')
      .select('id, name, slug, description, active, sort_order, created_at, updated_at')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    data = fallback.data
    error = fallback.error
  }

  if (error) throw error
  return (data || []).map(mapCategory)
}

export async function fetchCategoryTreeForAdmin() {
  const categories = await fetchCategoriesForAdmin()
  return {
    categories,
    tree: buildCategoryTree(categories),
    flat: flattenCategoryTree(categories),
  }
}

/** Root categories only — used as parent options in the editor. */
export async function fetchRootCategoriesForAdmin(excludeId = null) {
  const categories = await fetchCategoriesForAdmin()
  return categories.filter((item) => {
    if (item.parentId) return false
    if (excludeId && item.id === excludeId) return false
    return true
  })
}

export async function fetchCategoryById(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapCategory(data)
}

export async function isCategorySlugAvailable(slug, excludeId = null) {
  const supabase = await createClient()
  let query = supabase.from('categories').select('id').eq('slug', slug).limit(1)
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query
  if (error) throw error
  return !data?.length
}

export async function fetchCollectionsForAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select(COLLECTION_SELECT)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return (data || []).map(mapCollection)
}

export async function fetchCollectionById(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select(COLLECTION_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapCollection(data)
}

export async function isCollectionSlugAvailable(slug, excludeId = null) {
  const supabase = await createClient()
  let query = supabase.from('collections').select('id').eq('slug', slug).limit(1)
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query
  if (error) throw error
  return !data?.length
}

export { buildCategorySelectGroups, buildCategoryTree, flattenCategoryTree }
