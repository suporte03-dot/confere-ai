/** Prefix a public-folder path with Vite's base (e.g. `/confere-ai/` on GitHub Pages). */
export function assetUrl(path) {
  if (!path) return path
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${String(path).replace(/^\//, '')}`
}
