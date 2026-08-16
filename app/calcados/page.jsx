import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'

export const metadata = {
  title: 'Calçados — Terra & Estilo',
  description:
    'Botas, coturnos, tênis e chinelos selecionados para acompanhar o ritmo do campo à cidade com conforto e caráter.',
}

export default function CalcadosPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="calcados" />
    </Suspense>
  )
}
