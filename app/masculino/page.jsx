import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'

export const metadata = {
  title: 'Masculino — Terra & Estilo',
  description:
    'Cortes firmes, acabamento refinado e peças versáteis — o estilo masculino Terra & Estilo com identidade e autenticidade.',
}

export default function MasculinoPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="masculino" />
    </Suspense>
  )
}
