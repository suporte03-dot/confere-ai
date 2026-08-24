import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { buildCategoryMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildCategoryMetadata('feminino')

export default function FemininoPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="feminino" />
    </Suspense>
  )
}
