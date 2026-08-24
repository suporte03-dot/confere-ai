import { SITE_NAME, DEFAULT_DESCRIPTION, absoluteUrl } from './site'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/images/logo-terra-estilo.png'),
    description: DEFAULT_DESCRIPTION,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: DEFAULT_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo-terra-estilo.png'),
      },
    },
  }
}

/**
 * @param {object} product
 * @param {string} canonicalPath
 */
export function productSchema(product, canonicalPath) {
  if (!product) return null

  const images = []
  if (product.image) images.push(product.image)
  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      const url = typeof img === 'string' ? img : img?.url
      if (url && !images.includes(url)) images.push(url)
    }
  }

  const availability =
    product.available && (product.stock ?? 0) > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.description || '').trim() || undefined,
    image: images.length ? images : undefined,
    sku: product.sku || undefined,
    url: absoluteUrl(canonicalPath),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(canonicalPath),
      priceCurrency: 'BRL',
      price: Number(product.price) || 0,
      availability,
    },
  }
}

/**
 * @param {{ name: string, url: string }[]} items
 */
export function breadcrumbSchema(items) {
  if (!items?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}
