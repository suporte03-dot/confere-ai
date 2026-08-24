import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { buildCategoryMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildCategoryMetadata('masculino')

export default function MasculinoPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="masculino" />
    </Suspense>
  )
}
