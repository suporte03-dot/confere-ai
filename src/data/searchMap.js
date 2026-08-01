/**
 * Smart search + subcategory organization for Terra & Estilo.
 * Synonyms resolve to canonical subcategory keys and optional department.
 */

function normalizeSearchTerm(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export { normalizeSearchTerm as normalizeSearchQuery }

/** Canonical subcategory groups per store category (display order). */
export const CATEGORY_SUBGROUPS = {
  masculino: [
    { id: 'calcas', label: 'Calças', match: ['calca', 'calcas', 'jeans'] },
    { id: 'camisas', label: 'Camisas', match: ['camisa', 'camisas'] },
    { id: 'camisetas', label: 'Camisetas', match: ['camiseta', 'camisetas', 'blusa', 'blusas'] },
    { id: 'moletom', label: 'Moletons', match: ['moletom', 'moletons'] },
    { id: 'jaquetas', label: 'Jaquetas', match: ['jaqueta', 'jaquetas'] },
    { id: 'polos', label: 'Polos', match: ['polo', 'polos'] },
    { id: 'bermudas', label: 'Bermudas', match: ['bermuda', 'bermudas'] },
  ],
  feminino: [
    { id: 'calcas', label: 'Calças', match: ['calca', 'calcas', 'jeans'] },
    { id: 'blusas', label: 'Blusas & Camisetas', match: ['blusa', 'blusas', 'camiseta', 'camisetas'] },
    { id: 'camisas', label: 'Camisas', match: ['camisa', 'camisas'] },
    { id: 'moletom', label: 'Moletons', match: ['moletom', 'moletons'] },
    { id: 'jaquetas', label: 'Jaquetas', match: ['jaqueta', 'jaquetas'] },
    { id: 'vestidos', label: 'Vestidos', match: ['vestido', 'vestidos'] },
    { id: 'cropped', label: 'Cropped', match: ['cropped', 'crop'] },
    { id: 'body', label: 'Body', match: ['body', 'bodies'] },
  ],
  acessorios: [
    { id: 'bones', label: 'Bonés', match: ['bone', 'bones'] },
    { id: 'cintos', label: 'Cintos', match: ['cinto', 'cintos'] },
    { id: 'mochilas', label: 'Mochilas', match: ['mochila', 'mochilas'] },
    { id: 'bolsas', label: 'Bolsas', match: ['bolsa', 'bolsas'] },
  ],
  calcados: [
    { id: 'botas', label: 'Botas', match: ['bota', 'botas'] },
    { id: 'tenis', label: 'Tênis', match: ['tenis', 'tennis'] },
    { id: 'chinelos', label: 'Chinelos', match: ['chinelo', 'chinelos'] },
    { id: 'coturnos', label: 'Coturnos', match: ['coturno', 'coturnos'] },
  ],
  infantil: [
    { id: 'camisetas', label: 'Camisetas', match: ['camiseta', 'camisetas', 'blusa', 'blusas'] },
    { id: 'calcas', label: 'Calças', match: ['calca', 'calcas', 'jeans'] },
    { id: 'vestidos', label: 'Vestidos', match: ['vestido', 'vestidos'] },
    { id: 'conjuntos', label: 'Conjuntos', match: ['conjunto', 'conjuntos'] },
    { id: 'moletom', label: 'Moletons', match: ['moletom', 'moletons'] },
  ],
}

/** Global synonym → subcategory intent (used by header search). */
const SYNONYM_TO_SUB = {
  blusa: 'blusas',
  blusas: 'blusas',
  camiseta: 'camisetas',
  camisetas: 'camisetas',
  camisa: 'camisas',
  camisas: 'camisas',
  calca: 'calcas',
  calcas: 'calcas',
  jeans: 'calcas',
  moletom: 'moletom',
  moletons: 'moletom',
  jaqueta: 'jaquetas',
  jaquetas: 'jaquetas',
  polo: 'polos',
  polos: 'polos',
  bermuda: 'bermudas',
  bermudas: 'bermudas',
  vestido: 'vestidos',
  vestidos: 'vestidos',
  cropped: 'cropped',
  crop: 'cropped',
  body: 'body',
  bone: 'bones',
  bones: 'bones',
  cinto: 'cintos',
  cintos: 'cintos',
  mochila: 'mochilas',
  mochilas: 'mochilas',
  bolsa: 'bolsas',
  bolsas: 'bolsas',
  bota: 'botas',
  botas: 'botas',
  tenis: 'tenis',
  chinelo: 'chinelos',
  chinelos: 'chinelos',
  coturno: 'coturnos',
  coturnos: 'coturnos',
  conjunto: 'conjuntos',
  conjuntos: 'conjuntos',
}

const CATEGORY_TERMS = {
  feminino: 'feminino',
  masculino: 'masculino',
  calcados: 'calcados',
  acessorios: 'acessorios',
  infantil: 'infantil',
  colecoes: '__colecoes__',
  colecao: '__colecoes__',
  novidades: '__novidades__',
}

/** collectionId → canonical sub id */
const COLLECTION_TO_SUB = {
  'calca-jeans-masculina': 'calcas',
  'calca-jeans-feminina': 'calcas',
  'calcas-infantis': 'calcas',
  'camisas-masculinas': 'camisas',
  'camisas-femininas': 'camisas',
  'camisetas-masculinas': 'camisetas',
  'camisetas-femininas': 'blusas',
  'camisetas-infantis': 'camisetas',
  'moletons-masculinos': 'moletom',
  'moletons-infantis': 'moletom',
  'jaquetas-masculinas': 'jaquetas',
  'jaquetas-femininas': 'jaquetas',
  polos: 'polos',
  'bermudas-masculinas': 'bermudas',
  vestidos: 'vestidos',
  'vestidos-infantis': 'vestidos',
  cropped: 'cropped',
  body: 'body',
  bones: 'bones',
  cintos: 'cintos',
  mochilas: 'mochilas',
  'bolsas-femininas': 'bolsas',
  'bolsas-acessorios': 'bolsas',
  botas: 'botas',
  tenis: 'tenis',
  chinelos: 'chinelos',
  coturnos: 'coturnos',
  'conjuntos-infantis': 'conjuntos',
}

export function getSubgroupsForCategory(category) {
  return CATEGORY_SUBGROUPS[category] || []
}

export function resolveProductSubKey(product) {
  if (!product) return null
  if (product.subKey) return product.subKey

  const byCollection = COLLECTION_TO_SUB[product.collectionId]
  if (byCollection) {
    // Feminino camisetas/blusas share the "blusas" chip; masculino keeps camisetas.
    if (product.category === 'masculino' && byCollection === 'blusas') return 'camisetas'
    if (product.category === 'feminino' && byCollection === 'camisetas') return 'blusas'
    return byCollection
  }

  const hay = normalizeSearchTerm(
    [product.subcategory, product.name, product.collectionId].filter(Boolean).join(' '),
  )
  const groups = getSubgroupsForCategory(product.category)
  for (const group of groups) {
    if (group.match.some((token) => hay.includes(token))) return group.id
  }

  // Cross-category fallback for accessories named on clothing products, etc.
  for (const [token, subId] of Object.entries(SYNONYM_TO_SUB)) {
    if (hay.includes(token)) return subId
  }
  return null
}

export function getSubgroupLabel(category, subId) {
  if (!subId) return 'Todos'
  const group = getSubgroupsForCategory(category).find((g) => g.id === subId)
  if (group) return group.label
  // Global fallback labels
  const labels = {
    calcas: 'Calças',
    blusas: 'Blusas',
    camisetas: 'Camisetas',
    camisas: 'Camisas',
    moletom: 'Moletons',
    jaquetas: 'Jaquetas',
    polos: 'Polos',
    bermudas: 'Bermudas',
    vestidos: 'Vestidos',
    cropped: 'Cropped',
    body: 'Body',
    bones: 'Bonés',
    cintos: 'Cintos',
    mochilas: 'Mochilas',
    bolsas: 'Bolsas',
    botas: 'Botas',
    tenis: 'Tênis',
    chinelos: 'Chinelos',
    coturnos: 'Coturnos',
    conjuntos: 'Conjuntos',
  }
  return labels[subId] || subId
}

/**
 * Expand a search term into synonym tokens for product matching.
 */
export function expandSearchTokens(rawTerm) {
  const normalized = normalizeSearchTerm(rawTerm)
  if (!normalized) return []

  const tokens = normalized.split(/\s+/).filter(Boolean)
  const expanded = new Set(tokens)

  for (const token of tokens) {
    const subId = SYNONYM_TO_SUB[token]
    if (!subId) continue
    expanded.add(subId)
    // Add related match tokens from all category group defs
    for (const groups of Object.values(CATEGORY_SUBGROUPS)) {
      const group = groups.find((g) => g.id === subId || g.match.includes(token))
      if (group) group.match.forEach((m) => expanded.add(m))
    }
  }

  return [...expanded]
}

/**
 * Resolve header search into a navigation intent.
 * @returns {{ type: 'special'|'category'|'search', path?: string, q?: string, category?: string, sub?: string }}
 */
export function resolveSearchIntent(rawTerm) {
  const normalized = normalizeSearchTerm(rawTerm)
  if (!normalized) return { type: 'search', q: '' }

  // Exact department / special destinations
  if (CATEGORY_TERMS[normalized]) {
    const target = CATEGORY_TERMS[normalized]
    if (target === '__colecoes__') return { type: 'special', path: '/colecoes' }
    if (target === '__novidades__') return { type: 'special', path: '/#novidades' }
    return { type: 'category', category: target, path: `/${target}` }
  }

  const tokens = normalized.split(/\s+/).filter(Boolean)
  let category = null
  let sub = null
  const leftover = []

  for (const token of tokens) {
    if (CATEGORY_TERMS[token] && !String(CATEGORY_TERMS[token]).startsWith('__')) {
      category = CATEGORY_TERMS[token]
      continue
    }
    if (SYNONYM_TO_SUB[token]) {
      sub = SYNONYM_TO_SUB[token]
      continue
    }
    leftover.push(token)
  }

  // Map feminine-leaning "blusas" / masculine "camisetas" when category known
  if (sub === 'blusas' && category === 'masculino') sub = 'camisetas'
  if (sub === 'camisetas' && category === 'feminino') sub = 'blusas'

  // Department-specific subcategory → go straight to category with ?sub=
  if (category && sub && leftover.length === 0) {
    return {
      type: 'category',
      category,
      sub,
      path: `/${category}?sub=${encodeURIComponent(sub)}`,
      q: rawTerm.trim(),
    }
  }

  if (category && !sub && leftover.length === 0) {
    return { type: 'category', category, path: `/${category}`, q: rawTerm.trim() }
  }

  const params = new URLSearchParams()
  params.set('q', rawTerm.trim())
  if (sub) params.set('sub', sub)
  if (category) params.set('cat', category)

  return {
    type: 'search',
    q: rawTerm.trim(),
    sub: sub || undefined,
    category: category || undefined,
    path: `/busca?${params.toString()}`,
  }
}

export function productMatchesSubKey(product, subKey) {
  if (!subKey) return true
  const key = resolveProductSubKey(product)
  if (key === subKey) return true

  // Allow blusas ↔ camisetas cross-match on global search
  if (
    (subKey === 'blusas' && (key === 'camisetas' || key === 'blusas')) ||
    (subKey === 'camisetas' && (key === 'blusas' || key === 'camisetas'))
  ) {
    return true
  }
  return false
}

export function groupProductsBySubcategory(catalog, category = null) {
  const groupsDef = category
    ? getSubgroupsForCategory(category)
    : [
        ...CATEGORY_SUBGROUPS.masculino,
        ...CATEGORY_SUBGROUPS.feminino.filter((g) => !CATEGORY_SUBGROUPS.masculino.some((m) => m.id === g.id)),
        ...CATEGORY_SUBGROUPS.acessorios,
        ...CATEGORY_SUBGROUPS.calcados,
      ].filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i)

  // Prefer unique labels when grouping across categories
  const order = category
    ? groupsDef
    : [
        { id: 'calcas', label: 'Calças' },
        { id: 'blusas', label: 'Blusas' },
        { id: 'camisetas', label: 'Camisetas' },
        { id: 'camisas', label: 'Camisas' },
        { id: 'moletom', label: 'Moletons' },
        { id: 'jaquetas', label: 'Jaquetas' },
        { id: 'polos', label: 'Polos' },
        { id: 'bermudas', label: 'Bermudas' },
        { id: 'vestidos', label: 'Vestidos' },
        { id: 'cropped', label: 'Cropped' },
        { id: 'body', label: 'Body' },
        { id: 'bones', label: 'Bonés' },
        { id: 'cintos', label: 'Cintos' },
        { id: 'mochilas', label: 'Mochilas' },
        { id: 'bolsas', label: 'Bolsas' },
        { id: 'botas', label: 'Botas' },
        { id: 'tenis', label: 'Tênis' },
        { id: 'chinelos', label: 'Chinelos' },
        { id: 'coturnos', label: 'Coturnos' },
        { id: 'conjuntos', label: 'Conjuntos' },
      ]

  const buckets = new Map()
  for (const def of order) {
    buckets.set(def.id, { id: def.id, label: def.label, products: [] })
  }
  const other = { id: 'outros', label: 'Outros', products: [] }

  for (const product of catalog) {
    let key = resolveProductSubKey(product)
    if (key === 'blusas' && !buckets.has('blusas') && buckets.has('camisetas')) key = 'camisetas'
    if (key === 'camisetas' && !buckets.has('camisetas') && buckets.has('blusas')) key = 'blusas'
    const bucket = (key && buckets.get(key)) || other
    bucket.products.push(product)
  }

  const sections = [...buckets.values()].filter((s) => s.products.length > 0)
  if (other.products.length) sections.push(other)
  return sections
}
