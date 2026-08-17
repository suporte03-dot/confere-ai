import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { listProductsByCategorySlug } from '../../src/lib/catalog'

export const metadata = {
  title: 'Acessórios — Terra & Estilo',
  description:
    'Bonés, cintos, mochilas e peças que fecham o look com a assinatura Terra & Estilo — identidade em cada detalhe.',
}

export default async function AcessoriosPage() {
  const products = await listProductsByCategorySlug('acessorios')
  return (
    <Suspense fallback={null}>
      <CategoryPage category="acessorios" products={products} />
    </Suspense>
  )
}
