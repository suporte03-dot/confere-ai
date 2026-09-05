import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  INDEX_ROBOTS,
  NOINDEX_ROBOTS,
  absoluteUrl,
  canonicalPath,
  toAbsoluteMediaUrl,
} from './site'

export const rootMetadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: absoluteUrl('/') }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: INDEX_ROBOTS,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: absoluteUrl('/'),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: absoluteUrl('/images/logo-terra-estilo.png'),
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl('/images/logo-terra-estilo.png')],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: [{ url: '/icon-192.png', type: 'image/png', sizes: '192x192' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

/**
 * @param {{ title: string, description?: string, path: string, image?: string, noindex?: boolean }} opts
 */
export function buildPageMetadata({ title, description, path, image, noindex = false }) {
  const canonical = canonicalPath(path)
  const pageUrl = absoluteUrl(canonical)
  const pageDescription = description || DEFAULT_DESCRIPTION
  const imageUrl = toAbsoluteMediaUrl(image) || absoluteUrl('/images/logo-terra-estilo.png')

  return {
    title,
    description: pageDescription,
    robots: noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: pageUrl,
      siteName: SITE_NAME,
      title,
      description: pageDescription,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pageDescription,
      images: [imageUrl],
    },
  }
}

/**
 * @param {{ product: import('../catalog/adapt').adaptProduct extends (...args: any) => infer R ? R : never }} opts
 */
export function buildProductMetadata(product) {
  if (!product) {
    return buildPageMetadata({
      title: 'Produto não encontrado',
      path: '/',
      noindex: true,
    })
  }

  const path = `/produto/${product.slug || product.id}`
  const title = product.name
  const description =
    (product.description || '').trim() ||
    `${product.name} — ${SITE_NAME}. Moda premium com identidade e autenticidade.`
  const image = toAbsoluteMediaUrl(product.image)

  return {
    title,
    description,
    robots: INDEX_ROBOTS,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

/** @param {string} categoryKey */
export function buildCategoryMetadata(categoryKey) {
  const paths = {
    feminino: '/feminino',
    masculino: '/masculino',
    calcados: '/calcados',
    acessorios: '/acessorios',
  }
  const titles = {
    feminino: 'Feminino',
    masculino: 'Masculino',
    calcados: 'Calçados',
    acessorios: 'Acessórios',
  }
  const descriptions = {
    feminino:
      'Silhuetas leves, tecidos naturais e presença contemporânea — moda feminina Terra & Estilo.',
    masculino:
      'Cortes firmes, acabamento refinado e peças versáteis — moda masculina Terra & Estilo.',
    calcados: 'Calçados Terra & Estilo — conforto e presença do campo à cidade.',
    acessorios:
      'Bonés, cintos e detalhes que fecham o look com a assinatura Terra & Estilo.',
  }

  const path = paths[categoryKey] || `/categoria/${categoryKey}`
  const title = titles[categoryKey] || categoryKey

  return buildPageMetadata({
    title,
    description: descriptions[categoryKey] || DEFAULT_DESCRIPTION,
    path,
  })
}

export const privatePageMetadata = {
  checkout: buildPageMetadata({
    title: 'Checkout',
    description: 'Finalize seu pedido na Terra & Estilo.',
    path: '/checkout',
    noindex: true,
  }),
  busca: buildPageMetadata({
    title: 'Busca',
    description: 'Busque produtos na Terra & Estilo.',
    path: '/busca',
    noindex: true,
  }),
  notFound: buildPageMetadata({
    title: 'Página não encontrada',
    path: '/404',
    noindex: true,
  }),
}
