/** Prefix a public-folder path with the app base (Vite `BASE_URL` or `/` on Next). */
export function assetUrl(path) {
  if (!path) return path
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const base = resolveBaseUrl()
  return `${base}${String(path).replace(/^\//, '')}`
}

function resolveBaseUrl() {
  try {
    const viteBase = import.meta.env?.BASE_URL
    if (typeof viteBase === 'string' && viteBase.length > 0) return viteBase
  } catch {
    // Next / non-Vite bundlers may not expose import.meta.env.BASE_URL
  }
  return '/'
}
