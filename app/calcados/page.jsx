import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { listProductsByCategorySlug } from '../../src/lib/catalog'

export const metadata = {
  title: 'Calçados — Terra & Estilo',
  description:
    'Botas, coturnos, tênis e chinelos selecionados para acompanhar o ritmo do campo à cidade com conforto e caráter.',
}

export default async function CalcadosPage() {
  const products = await listProductsByCategorySlug('calcados')
  return (
    <Suspense fallback={null}>
      <CategoryPage category="calcados" products={products} />
    </Suspense>
  )
}
