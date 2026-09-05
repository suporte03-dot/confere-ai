/** Default fill suggestions — not persisted until the admin saves. */
export const DEFAULT_COLLECTION_NAME_SUGGESTIONS = [
  'Verão',
  'Inverno',
  'Primavera',
  'Outono',
  'Alto Verão',
  'Meia Estação',
]

/**
 * Normalize a collection name for duplicate detection / search.
 * Ignores case, accents, and extra whitespace.
 */
export function normalizeCollectionName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function collectionNamesMatch(a, b) {
  const left = normalizeCollectionName(a)
  const right = normalizeCollectionName(b)
  if (!left || !right) return false
  return left === right
}

export function findCollectionByNormalizedName(
  collections,
  name,
  { excludeId = null } = {},
) {
  const key = normalizeCollectionName(name)
  if (!key) return null
  return (
    (collections || []).find((item) => {
      if (excludeId && item.id === excludeId) return false
      return normalizeCollectionName(item.name) === key
    }) || null
  )
}

export function matchesCollectionQuery(name, query) {
  const needle = normalizeCollectionName(query)
  if (!needle) return true
  return normalizeCollectionName(name).includes(needle)
}

/**
 * Build dropdown sections for the creatable name combobox.
 * Suggestions that already exist in the DB are omitted from SUGESTÕES.
 */
export function buildCollectionNameOptions({
  existingCollections = [],
  suggestions = DEFAULT_COLLECTION_NAME_SUGGESTIONS,
  query = '',
  excludeId = null,
} = {}) {
  const existing = (existingCollections || []).filter((item) => {
    if (excludeId && item.id === excludeId) return false
    return matchesCollectionQuery(item.name, query)
  })

  const existingKeys = new Set(
    (existingCollections || []).map((item) => normalizeCollectionName(item.name)),
  )

  const suggestionItems = (suggestions || [])
    .filter((label) => {
      const key = normalizeCollectionName(label)
      if (!key || existingKeys.has(key)) return false
      return matchesCollectionQuery(label, query)
    })
    .map((label) => ({ name: label }))

  const trimmed = String(query || '').trim()
  const anyExistingMatch = findCollectionByNormalizedName(existingCollections, trimmed)
  const duplicate = findCollectionByNormalizedName(existingCollections, trimmed, {
    excludeId,
  })
  const createLabel = trimmed && !anyExistingMatch ? trimmed : null

  return {
    existing,
    suggestions: suggestionItems,
    createLabel,
    duplicate,
  }
}
