import { slugify } from './slugify.js'

const SIZE_RE = /^(pp|p|m|g|gg|xg|xgg|xs|s|l|xl|xxl|\d{2,3})$/i

export const AI_SUGGEST_FIELDS = [
  'name',
  'productType',
  'categoryId',
  'primaryColor',
  'secondaryColors',
  'description',
  'slug',
  'detectedSize',
]

function asString(value, max = 240) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  return text.slice(0, max)
}

function asStringArray(value, maxItems = 4) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => asString(item, 40))
    .filter(Boolean)
    .slice(0, maxItems)
}

function matchCategory(raw, categories = []) {
  if (!Array.isArray(categories) || !categories.length) return null
  const id = asString(raw?.categoryId || raw?.category_id, 80)
  if (id && categories.some((c) => c.id === id)) return id

  const label = asString(raw?.categoryName || raw?.category, 80).toLowerCase()
  if (!label) return null
  const exact = categories.find(
    (c) =>
      String(c.name || '').toLowerCase() === label ||
      String(c.slug || '').toLowerCase() === label,
  )
  if (exact) return exact.id
  const partial = categories.find((c) => {
    const name = String(c.name || '').toLowerCase()
    const slug = String(c.slug || '').toLowerCase()
    return name.includes(label) || label.includes(name) || slug.includes(label)
  })
  return partial?.id || null
}

function parseJsonPayload(text) {
  const raw = String(text || '').trim()
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start < 0 || end <= start) return null
    try {
      return JSON.parse(raw.slice(start, end + 1))
    } catch {
      return null
    }
  }
}

export function emptySuggestion() {
  return {
    name: '',
    productType: '',
    categoryId: null,
    categoryName: '',
    primaryColor: '',
    secondaryColors: [],
    description: '',
    slug: '',
    detectedSize: null,
    photoQuality: {
      suitableCover: null,
      issues: [],
    },
  }
}

export function normalizeAiSuggestion(raw, categories = []) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const name = asString(source.name, 120)
  const productType = asString(source.productType || source.type, 60)
  const primaryColor = asString(source.primaryColor || source.color, 40)
  const description = asString(source.description, 900)
  const slugSource = source.slug || name
  const categoryId = matchCategory(source, categories)
  const category = categories.find((c) => c.id === categoryId) || null

  let detectedSize = asString(source.detectedSize || source.size, 12)
  const sizeConfidence = Number(source.confidence?.detectedSize ?? source.sizeConfidence)
  if (!SIZE_RE.test(detectedSize) || (Number.isFinite(sizeConfidence) && sizeConfidence < 0.8)) {
    detectedSize = ''
  }

  const issues = asStringArray(source.photoQuality?.issues || source.photoIssues, 6)
  const suitable =
    typeof source.photoQuality?.suitableCover === 'boolean'
      ? source.photoQuality.suitableCover
      : issues.length === 0
        ? true
        : null

  return {
    name,
    productType,
    categoryId,
    categoryName: category?.name || '',
    primaryColor,
    secondaryColors: asStringArray(source.secondaryColors, 4),
    description,
    slug: slugify(slugSource),
    detectedSize: detectedSize || null,
    photoQuality: {
      suitableCover: suitable,
      issues,
    },
  }
}

export function parseAiSuggestionText(text, categories = []) {
  const parsed = parseJsonPayload(text)
  if (!parsed) return null
  return normalizeAiSuggestion(parsed, categories)
}

export function buildSuggestSystemPrompt(categories = []) {
  const catalog = categories
    .map((c) => `- ${c.name} (id: ${c.id}, slug: ${c.slug || ''})`)
    .join('\n')

  return `Você é um assistente de cadastro da loja Terra & Estilo, moda agro premium brasileira.
Analise a foto de uma peça de roupa ou acessório e devolva SOMENTE JSON válido, sem markdown.

Regras:
- Sugira nome comercial, tipo da peça, cor principal, cores secundárias visíveis, descrição comercial curta e slug.
- Mapeie categoryId para UMA categoria existente abaixo. Se não houver correspondência segura, use categoryId null.
- Nunca infira gênero/categoria só pela aparência da pessoa na foto. Analise a peça.
- Nunca invente preço, estoque, SKU, quantidade, composição de tecido (salvo etiqueta visível) ou marca.
- Não sugira tamanhos (P/M/G/38/40) a menos que a etiqueta esteja claramente legível. Caso contrário detectedSize deve ser null.
- Avalie a foto para capa: escura, produto pouco visível, baixa resolução, enquadramento ruim. Não bloqueie o cadastro; apenas recomende.

Categorias existentes:
${catalog || '- (nenhuma)'}

Formato:
{
  "name": "",
  "productType": "",
  "categoryId": null,
  "categoryName": "",
  "primaryColor": "",
  "secondaryColors": [],
  "description": "",
  "slug": "",
  "detectedSize": null,
  "confidence": { "category": 0, "detectedSize": 0 },
  "photoQuality": { "suitableCover": true, "issues": [] }
}`
}
