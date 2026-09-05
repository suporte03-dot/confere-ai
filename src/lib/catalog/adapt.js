import { productImagePublicUrl } from '../admin/format'
import { assetUrl } from '../../utils/assetUrl'
import { brandCollections, categoryMeta } from '../../data/catalog'

const NEW_DAYS = 45
const FALLBACK_IMAGE = assetUrl('/images/terraestilo/fallback-produto.jpg')

/** Strip accents / trim for route-safe category slugs (e.g. acessórios → acessorios). */
export function normalizeCatalogSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), 'pt-BR', { numeric: true }),
  )
}

function pickCoverImage(images = []) {
  const sorted = [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  return sorted.find((img) => img.is_cover) || sorted[0] || null
}

function mapImages(images = []) {
  return [...images]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((img) => ({
      id: img.id,
      url: productImagePublicUrl(img.storage_path),
      alt: img.alt_text || '',
      isCover: Boolean(img.is_cover),
      position: img.position ?? 0,
    }))
    .filter((img) => Boolean(img.url))
}

function isRecentlyCreated(createdAt) {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < NEW_DAYS * 24 * 60 * 60 * 1000
}

function deriveBadge({ featured, isNew, compareAtPrice, price }) {
  if (featured) return 'Destaque'
  if (isNew) return 'Novidade'
  if (compareAtPrice != null && Number(compareAtPrice) > Number(price)) return 'Oferta'
  return null
}

function resolveCategorySlug(category) {
  if (!category) return null
  const slug = normalizeCatalogSlug(category.slug)
  if (slug === 'feminino' || slug === 'masculino' || slug === 'calcados' || slug === 'acessorios' || slug === 'infantil') {
    return slug
  }
  if (slug) return slug
  const name = normalizeCatalogSlug(category.name)
  if (name.includes('femin')) return 'feminino'
  if (name.includes('mascul')) return 'masculino'
  if (name.includes('calcad')) return 'calcados'
  if (name.includes('acessor')) return 'acessorios'
  if (name.includes('infantil')) return 'infantil'
  return name || null
}

/** Public storefront only uses active variants; stock is never invented. */
function activeVariantsFromRow(row) {
  return [...(row.product_variants || [])]
    .filter((v) => v && v.active !== false)
    .sort((a, b) => {
      const sizeCmp = String(a.size || '').localeCompare(String(b.size || ''), 'pt-BR', {
        numeric: true,
      })
      if (sizeCmp !== 0) return sizeCmp
      return String(a.color || '').localeCompare(String(b.color || ''), 'pt-BR')
    })
}

/**
 * Maps a Supabase product row to the storefront ProductCard / page shape.
 */
export function adaptProduct(row, { detail = false } = {}) {
  if (!row) return null

  const category = row.category || null
  const collection = row.collection || null
  const categorySlug = resolveCategorySlug(category)
  const collectionSlug = collection?.slug || null
  const mappedImages = mapImages(row.product_images || [])
  const cover = mappedImages.find((img) => img.isCover) || mappedImages[0] || null
  const secondary = mappedImages.find((img) => img.url !== cover?.url) || cover

  const variants = activeVariantsFromRow(row)
  const sizes = uniqueSorted(variants.map((v) => v.size).filter(Boolean))
  const colors = uniqueSorted(variants.map((v) => v.color).filter(Boolean))
  // Availability comes only from active variants — do not invent stock.
  const stock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
  const available = variants.length > 0 && stock > 0
  const price = Number(row.price) || 0
  const oldPrice =
    row.compare_at_price != null && Number(row.compare_at_price) > 0
      ? Number(row.compare_at_price)
      : null
  const featured = Boolean(row.featured)
  const isNew = isRecentlyCreated(row.created_at)
  const badge = deriveBadge({ featured, isNew, compareAtPrice: oldPrice, price })
  const image = cover?.url || FALLBACK_IMAGE
  const hoverImage = secondary?.url || image

  const product = {
    id: row.id,
    slug: row.slug,
    source: 'supabase',
    name: row.name,
    description: row.description || '',
    price,
    oldPrice,
    compareAtPrice: oldPrice,
    badge,
    new: isNew,
    featured,
    colors,
    sizes,
    image,
    hoverImage,
    images: mappedImages,
    variants: variants.map((v) => ({
      id: v.id,
      size: v.size || null,
      color: v.color || null,
      stock: Number(v.stock) || 0,
      sku: v.sku || null,
      active: true,
    })),
    stock,
    available,
    sku: row.sku || null,
    categoryId: row.category_id || category?.id || null,
    collectionIdRaw: row.collection_id || collection?.id || null,
    category: categorySlug,
    department: category?.name || categoryMeta[categorySlug]?.title || '',
    subcategory: collection?.name || '',
    collection: collectionSlug,
    collectionId: collectionSlug,
    collectionName: collection?.name || '',
    categoryName: category?.name || '',
    categorySlug,
    collectionSlug,
    installments: 10,
    createdAt: row.created_at || null,
    sortOrder: Number(row.sort_order) || 0,
  }

  return product
}

export function adaptCategory(row) {
  if (!row) return null
  const rawSlug = String(row.slug || '').trim()
  const slug = resolveCategorySlug({ slug: rawSlug, name: row.name }) || normalizeCatalogSlug(rawSlug)
  const meta = categoryMeta[slug] || null
  return {
    id: row.id,
    name: row.name,
    slug,
    rawSlug,
    description: row.description || meta?.description || '',
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order) || 0,
    parentId: row.parent_id || row.parentId || null,
    title: meta?.title || row.name,
    eyebrow: meta?.eyebrow || 'Categoria',
    headline: meta?.headline || row.name,
    bannerImage: meta?.bannerImage || FALLBACK_IMAGE,
    objectPosition: meta?.objectPosition || 'center 28%',
  }
}

export function adaptCollection(row, { products = [] } = {}) {
  if (!row) return null
  const slug = String(row.slug || '').trim()
  const brand = brandCollections.find((c) => c.slug === slug)
  return {
    id: row.id,
    name: row.name,
    title: row.name,
    slug,
    description: row.description || brand?.description || '',
    active: Boolean(row.active),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order) || 0,
    image: brand?.image || FALLBACK_IMAGE,
    objectPosition: brand?.objectPosition || 'center 28%',
    products,
  }
}

export function pickCoverFromRow(row) {
  const cover = pickCoverImage(row?.product_images || [])
  return cover ? productImagePublicUrl(cover.storage_path) : null
}
