import { Suspense } from 'react'
import CategoryPage from '../../src/views/CategoryPage'
import { buildCategoryMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildCategoryMetadata('acessorios')

export default function AcessoriosPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPage category="acessorios" />
    </Suspense>
  )
}
