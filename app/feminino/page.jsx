import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'

export const metadata = {
  title: 'Feminino — Terra & Estilo',
  description:
    'Silhuetas leves, tecidos naturais e presença contemporânea — moda feminina que honra a terra e traduz sofisticação do Sul do Brasil.',
}

export default function FemininoPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="feminino" />
    </Suspense>
  )
}
