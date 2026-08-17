/**
 * Generates a URL slug from a product name (pt-BR friendly).
 * Example: "Vestido Country Preto" → "vestido-country-preto"
 */
export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
