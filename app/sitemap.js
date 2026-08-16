const BASE = 'https://terraeestilo.com.br'

const ROUTES = [
  '/',
  '/busca',
  '/feminino',
  '/masculino',
  '/calcados',
  '/acessorios',
  '/colecoes',
  '/sobre',
  '/lojas',
  '/contato',
]

export default function sitemap() {
  const lastModified = new Date()
  return ROUTES.map((path) => ({
    url: `${BASE}${path === '/' ? '' : path}`,
    lastModified,
  }))
}
