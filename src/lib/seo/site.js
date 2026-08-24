/** Canonical production origin (always www). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terraeestilo.com.br'
).replace(/\/$/, '')

export const SITE_NAME = 'Terra & Estilo'

export const DEFAULT_TITLE = 'Terra & Estilo | Moda, Estilo e Autenticidade'

export const DEFAULT_DESCRIPTION =
  'Terra & Estilo — moda premium com identidade do agro brasileiro. Roupas, acessórios e coleções com elegância, autenticidade e estilo para campo e cidade.'

export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
}

export const INDEX_ROBOTS = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
}

/** @param {string} path */
export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

/** @param {string} path */
export function canonicalPath(path = '/') {
  if (!path || path === '/') return '/'
  return path.startsWith('/') ? path : `/${path}`
}

/** @param {string | null | undefined} url */
export function toAbsoluteMediaUrl(url) {
  if (!url) return undefined
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return absoluteUrl(url)
  return url
}

export const STATIC_INDEX_ROUTES = [
  '/',
  '/feminino',
  '/masculino',
  '/calcados',
  '/acessorios',
  '/colecoes',
  '/sobre',
  '/lojas',
  '/contato',
]
