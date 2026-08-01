import { assetUrl } from '../utils/assetUrl'
import { products, getProductSizes } from './mockData'
import { getSubgroupsForCategory, getSubgroupLabel, productMatchesSubKey } from './searchMap'

export const CATEGORY_SLUGS = ['feminino', 'masculino', 'calcados', 'acessorios']

export const categoryRoutes = {
  feminino: '/feminino',
  masculino: '/masculino',
  calcados: '/calcados',
  acessorios: '/acessorios',
}

export const filterToRoute = {
  Feminino: '/feminino',
  Masculino: '/masculino',
  Calçados: '/calcados',
  Acessórios: '/acessorios',
  feminino: '/feminino',
  masculino: '/masculino',
  calcados: '/calcados',
  acessorios: '/acessorios',
  Infantil: '/colecoes',
  Outlet: '/colecoes',
  Todos: '/',
}

export const brandCollections = [
  {
    slug: 'raizes-do-sul',
    title: 'Raízes do Sul',
    description:
      'Peças com tons naturais, cortes atemporais e acabamento refinado — a essência da campanha Terra & Estilo.',
    image: assetUrl('/images/categorias/camisas.jpg'),
    objectPosition: 'center 28%',
  },
  {
    slug: 'essencia-do-campo',
    title: 'Essência do Campo',
    description:
      'Texturas, camadas e presença para o dia a dia no campo e na cidade — autenticidade em cada detalhe.',
    image: assetUrl('/images/categorias/jaquetas-masculinas.jpg'),
    objectPosition: 'center 22%',
  },
  {
    slug: 'classicos-terra-estilo',
    title: 'Clássicos Terra & Estilo',
    description:
      'Essenciais atemporais que sustentam o guarda-roupa: polos, jeans, acessórios e bases premium.',
    image: assetUrl('/images/categorias/polos.jpg'),
    objectPosition: 'center 30%',
  },
]

export const categoryMeta = {
  feminino: {
    slug: 'feminino',
    title: 'Feminino',
    eyebrow: 'Coleção feminina',
    headline: 'Elegância com raízes',
    description:
      'Silhuetas leves, tecidos naturais e presença contemporânea — moda feminina que honra a terra e traduz sofisticação do Sul do Brasil.',
    bannerImage: assetUrl('/images/categorias/camisas.jpg'),
    objectPosition: 'center 26%',
  },
  masculino: {
    slug: 'masculino',
    title: 'Masculino',
    eyebrow: 'Coleção masculina',
    headline: 'Presença para campo e cidade',
    description:
      'Cortes firmes, acabamento refinado e peças versáteis — o estilo masculino Terra & Estilo com identidade e autenticidade.',
    bannerImage: assetUrl('/images/categorias/jaquetas-masculinas.jpg'),
    objectPosition: 'center 20%',
  },
  calcados: {
    slug: 'calcados',
    title: 'Calçados',
    eyebrow: 'Base do look',
    headline: 'Passos com presença',
    description:
      'Botas, coturnos, tênis e chinelos selecionados para acompanhar o ritmo do campo à cidade com conforto e caráter.',
    bannerImage: assetUrl('/images/categorias/calca-jeans-masculinas.jpg'),
    objectPosition: 'center 72%',
  },
  acessorios: {
    slug: 'acessorios',
    title: 'Acessórios',
    eyebrow: 'Detalhes que completam',
    headline: 'O toque final',
    description:
      'Bonés, cintos, mochilas e peças que fecham o look com a assinatura Terra & Estilo — identidade em cada detalhe.',
    bannerImage: assetUrl('/images/categorias/acessorios.jpg'),
    objectPosition: 'center 30%',
  },
}

export const PRICE_RANGES = [
  { id: 'all', label: 'Todos os preços', min: 0, max: Infinity },
  { id: 'ate-150', label: 'Até R$ 150', min: 0, max: 150 },
  { id: '150-300', label: 'R$ 150 – R$ 300', min: 150, max: 300 },
  { id: '300-500', label: 'R$ 300 – R$ 500', min: 300, max: 500 },
  { id: 'acima-500', label: 'Acima de R$ 500', min: 500, max: Infinity },
]

export const SORT_OPTIONS = [
  { id: 'relevantes', label: 'Mais relevantes' },
  { id: 'mais-vendidos', label: 'Mais vendidos' },
  { id: 'novidades', label: 'Novidades' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
]

export function getProductsByCategory(category, catalog = products) {
  if (!category) return catalog
  return catalog.filter((p) => p.category === category)
}

export function getProductsByCollection(slug, catalog = products) {
  if (!slug) return catalog
  return catalog.filter((p) => p.collection === slug)
}

export function getCollectionMeta(slug) {
  return brandCollections.find((c) => c.slug === slug) ?? null
}

export function getFacetOptions(catalog, category = null) {
  const rawSubs = [...new Set(catalog.map((p) => p.subcategory).filter(Boolean))].sort()
  const groups = getSubgroupsForCategory(category)
  const presentKeys = new Set(catalog.map((p) => p.subKey).filter(Boolean))
  const subGroups = groups
    .filter((g) => presentKeys.has(g.id))
    .map((g) => ({ id: g.id, label: g.label }))

  // Fallback when category has no predefined groups
  const subcategories = subGroups.length
    ? subGroups.map((g) => g.label)
    : rawSubs

  const colors = [...new Set(catalog.flatMap((p) => p.colors || []))].sort()
  const sizes = [...new Set(catalog.flatMap((p) => getProductSizes(p)))].sort((a, b) => {
    const order = ['Único', 'PP', 'P', 'M', 'G', 'GG', '2', '4', '6', '8', '10']
    const ai = order.indexOf(a)
    const bi = order.indexOf(b)
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    return String(a).localeCompare(String(b), 'pt-BR', { numeric: true })
  })
  return { subcategories, subGroups, colors, sizes }
}

function scoreRelevance(product) {
  let score = 0
  if (product.featured) score += 4
  if (product.new) score += 3
  const badge = String(product.badge || '').toLowerCase()
  if (badge.includes('mais vendido')) score += 5
  if (badge.includes('destaque')) score += 3
  if (badge.includes('premium')) score += 2
  if (badge.includes('novo') || badge.includes('novidade')) score += 2
  return score
}

export function applyCatalogFilters(catalog, filters) {
  const {
    subcategory = '',
    subKey = '',
    size = '',
    color = '',
    priceRange = 'all',
    availability = 'all',
    onlyNew = false,
    onlyBestsellers = false,
  } = filters

  const range = PRICE_RANGES.find((r) => r.id === priceRange) || PRICE_RANGES[0]

  return catalog.filter((product) => {
    if (subKey && !productMatchesSubKey(product, subKey)) return false
    if (
      subcategory &&
      !subKey &&
      product.subcategory !== subcategory &&
      getSubgroupLabel(product.category, product.subKey) !== subcategory
    ) {
      return false
    }
    if (color && !(product.colors || []).includes(color)) return false
    if (size && !getProductSizes(product).includes(size)) return false
    if (!(product.price >= range.min && (range.max === Infinity || product.price <= range.max))) {
      return false
    }
    if (availability === 'in-stock' && !(product.stock > 0)) return false
    if (availability === 'out-of-stock' && product.stock > 0) return false
    if (onlyNew && !product.new && !/novo|novidade/i.test(String(product.badge || ''))) return false
    if (
      onlyBestsellers &&
      !product.featured &&
      !/mais vendido|destaque/i.test(String(product.badge || ''))
    ) {
      return false
    }
    return true
  })
}

export function sortCatalog(catalog, sortId = 'relevantes') {
  const list = [...catalog]
  switch (sortId) {
    case 'mais-vendidos':
      return list.sort((a, b) => scoreRelevance(b) - scoreRelevance(a) || b.price - a.price)
    case 'novidades':
      return list.sort((a, b) => Number(b.new) - Number(a.new) || scoreRelevance(b) - scoreRelevance(a))
    case 'menor-preco':
      return list.sort((a, b) => a.price - b.price)
    case 'maior-preco':
      return list.sort((a, b) => b.price - a.price)
    case 'relevantes':
    default:
      return list.sort((a, b) => scoreRelevance(b) - scoreRelevance(a) || a.name.localeCompare(b.name, 'pt-BR'))
  }
}

export function filterAndSortProducts(catalog, filters, sortId) {
  return sortCatalog(applyCatalogFilters(catalog, filters), sortId)
}

/** Resolve legacy filter labels / ids to a navigable path. */
export function pathForFilter(filterId) {
  if (!filterId || filterId === 'Todos') return '/'
  return filterToRoute[filterId] || '/colecoes'
}
