import { Suspense } from 'react'
import CategoryPage from '../../../src/views/CategoryPage'
import { buildCategoryMetadata } from '../../../src/lib/seo/metadata'

export async function generateMetadata({ params }) {
  const resolved = await params
  const slug = resolved?.slug || ''
  return buildCategoryMetadata(slug)
}

export default async function DynamicCategoryPage({ params }) {
  const resolved = await params
  const slug = resolved?.slug || ''

  return (
    <Suspense fallback={null}>
      <CategoryPage category={slug} />
    </Suspense>
  )
}
