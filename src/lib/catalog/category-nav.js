import { buildCategoryTree } from '../admin/category-tree.js'

// Re-export tree helpers for storefront use
export { buildCategoryTree, flattenCategoryTree } from '../admin/category-tree.js'

const KNOWN_CATEGORY_PATHS = new Set([
  'feminino',
  'masculino',
  'acessorios',
  'calcados',
  'infantil',
])

export function publicCategoryHref(slug, subSlug = null) {
  const base = KNOWN_CATEGORY_PATHS.has(slug) ? `/${slug}` : `/categoria/${slug}`
  if (!subSlug) return base
  return `${base}?sub=${encodeURIComponent(subSlug)}`
}

export function buildPublicCategoryNav(categories = []) {
  const roots = buildCategoryTree(
    (categories || []).filter((c) => c && c.active !== false),
  ).filter((root) => !root.parentId)

  return roots.map((root) => ({
    id: root.id,
    name: root.name,
    slug: root.slug,
    href: publicCategoryHref(root.slug),
    children: (root.children || []).map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      href: publicCategoryHref(root.slug, child.slug),
    })),
  }))
}

export function findCategoryNavNode(categories = [], slug) {
  const key = String(slug || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const nav = buildPublicCategoryNav(categories)
  return (
    nav.find((item) => {
      const s = String(item.slug || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      return s === key
    }) || null
  )
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function findChildInNavNode(node, subSlug) {
  if (!node || !subSlug) return null
  const key = normalizeKey(subSlug)
  return (
    (node.children || []).find((child) => {
      const slug = normalizeKey(child.slug)
      const name = normalizeKey(child.name)
      return slug === key || name === key || slug.endsWith(`-${key}`)
    }) || null
  )
}

export function collectCategoryScopeIds(rootNode) {
  if (!rootNode) return []
  const ids = [rootNode.id]
  for (const child of rootNode.children || []) {
    if (child?.id) ids.push(child.id)
  }
  return ids
}

/**
 * Products for a principal category (root + children), optionally filtered by child slug.
 */
export function getProductsForCategoryScope(
  categorySlug,
  catalog = [],
  categories = [],
  subSlug = '',
) {
  const node = findCategoryNavNode(categories, categorySlug)
  if (!node) {
    // Fallback: match product category slug only
    const key = String(categorySlug || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    return (catalog || []).filter((p) => {
      const slug = String(p.category || p.categorySlug || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      return slug === key
    })
  }

  if (subSlug) {
    const child = findChildInNavNode(node, subSlug)
    if (!child) return []
    return (catalog || []).filter(
      (p) => p.categoryId === child.id || p.categorySlug === child.slug,
    )
  }

  const scope = new Set(collectCategoryScopeIds(node))
  return (catalog || []).filter((p) => {
    if (p.categoryId && scope.has(p.categoryId)) return true
    const slug = String(p.category || p.categorySlug || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const rootSlug = String(node.slug || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    return slug === rootSlug
  })
}

export function getDbSubGroupsForCategory(categorySlug, categories = []) {
  const node = findCategoryNavNode(categories, categorySlug)
  if (!node) return []
  return (node.children || []).map((child) => ({
    id: child.slug,
    label: child.name,
  }))
}
