import CollectionsPage from '../../../src/views/CollectionsPage'
import { getCollectionBySlug } from '../../../src/lib/catalog'
import { buildPageMetadata } from '../../../src/lib/seo/metadata'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) {
    return buildPageMetadata({
      title: 'Coleção não encontrada',
      path: '/colecoes',
      noindex: true,
    })
  }
  return buildPageMetadata({
    title: collection.title || collection.name,
    description: collection.description || undefined,
    path: `/colecoes/${slug}`,
  })
}

export default async function ColecaoSlugPage({ params }) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  return (
    <CollectionsPage
      slug={slug}
      collection={collection}
      notFoundCollection={!collection}
    />
  )
}
