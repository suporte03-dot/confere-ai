import { Suspense } from 'react'
import SearchPage from '../../src/views/SearchPage'
import { privatePageMetadata } from '../../src/lib/seo/metadata'

export const metadata = privatePageMetadata.busca

export default function BuscaPage() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  )
}
