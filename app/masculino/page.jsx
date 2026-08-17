import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { listProductsByCategorySlug } from '../../src/lib/catalog'

export const metadata = {
  title: 'Masculino — Terra & Estilo',
  description:
    'Cortes firmes, acabamento refinado e peças versáteis — o estilo masculino Terra & Estilo com identidade e autenticidade.',
}

export default async function MasculinoPage() {
  const products = await listProductsByCategorySlug('masculino')
  return (
    <Suspense fallback={null}>
      <CategoryPage category="masculino" products={products} />
    </Suspense>
  )
}
