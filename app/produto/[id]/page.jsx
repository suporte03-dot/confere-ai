import { notFound, redirect } from 'next/navigation'
import ProductDetailPage from '../../../src/views/ProductDetailPage'
import {
  getProductBySlugOrId,
  productParamIsUuid,
} from '../../../src/lib/catalog'

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await getProductBySlugOrId(id)
  if (!product) {
    return { title: 'Produto não encontrado — Terra & Estilo' }
  }
  return {
    title: `${product.name} — Terra & Estilo`,
    description: product.description || undefined,
  }
}

export default async function ProdutoPage({ params }) {
  const { id } = await params
  const product = await getProductBySlugOrId(id)

  if (!product) notFound()

  // Canonical URL uses slug; keep UUID links working via redirect.
  if (product.slug && id !== product.slug && productParamIsUuid(id)) {
    redirect(`/produto/${product.slug}`)
  }

  return <ProductDetailPage product={product} />
}
