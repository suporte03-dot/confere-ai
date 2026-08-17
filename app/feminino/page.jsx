import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { listProductsByCategorySlug } from '../../src/lib/catalog'

export const metadata = {
  title: 'Feminino — Terra & Estilo',
  description:
    'Silhuetas leves, tecidos naturais e presença contemporânea — moda feminina que honra a terra e traduz sofisticação do Sul do Brasil.',
}

export default async function FemininoPage() {
  const products = await listProductsByCategorySlug('feminino')
  return (
    <Suspense fallback={null}>
      <CategoryPage category="feminino" products={products} />
    </Suspense>
  )
}
