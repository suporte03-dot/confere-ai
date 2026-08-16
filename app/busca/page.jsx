import { Suspense } from 'react'
import SearchPage from '../../src/views/SearchPage'

export const metadata = {
  title: 'Busca — Terra & Estilo',
  description:
    'Terra & Estilo — A marca do agro brasileiro. Moda premium com identidade, elegância e autenticidade.',
}

export default function BuscaPage() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  )
}
