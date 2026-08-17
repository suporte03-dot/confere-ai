import CollectionsPage from '../../../src/views/CollectionsPage'
import { getCollectionBySlug } from '../../../src/lib/catalog'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) {
    return { title: 'Coleção não encontrada — Terra & Estilo' }
  }
  return {
    title: `${collection.title || collection.name} — Terra & Estilo`,
    description: collection.description || undefined,
  }
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
