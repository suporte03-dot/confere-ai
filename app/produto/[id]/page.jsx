import { notFound, redirect } from 'next/navigation'
import ProductDetailPage from '../../../src/views/ProductDetailPage'
import JsonLd from '../../../src/components/seo/JsonLd'
import {
  getProductBySlugOrId,
  productParamIsUuid,
} from '../../../src/lib/catalog'
import { buildProductMetadata } from '../../../src/lib/seo/metadata'
import { breadcrumbSchema, productSchema } from '../../../src/lib/seo/schema'
import { pathForFilter } from '../../../src/data/catalog'

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await getProductBySlugOrId(id)
  return buildProductMetadata(product)
}

export default async function ProdutoPage({ params }) {
  const { id } = await params
  const product = await getProductBySlugOrId(id)

  if (!product) notFound()

  // Canonical URL uses slug; keep UUID links working via redirect.
  if (product.slug && id !== product.slug && productParamIsUuid(id)) {
    redirect(`/produto/${product.slug}`)
  }

  const canonicalPath = `/produto/${product.slug || product.id}`
  const categoryHref = pathForFilter(product.department || product.category || 'Todos')

  const breadcrumbs = breadcrumbSchema([
    { name: 'Início', url: '/' },
    {
      name: product.department || product.categoryName || 'Catálogo',
      url: categoryHref,
    },
    { name: product.name, url: canonicalPath },
  ])

  const productJson = productSchema(product, canonicalPath)

  return (
    <>
      <JsonLd data={[productJson, breadcrumbs].filter(Boolean)} />
      <ProductDetailPage product={product} />
    </>
  )
}
