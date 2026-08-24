import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { buildCategoryMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildCategoryMetadata('calcados')

export default function CalcadosPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="calcados" />
    </Suspense>
  )
}
