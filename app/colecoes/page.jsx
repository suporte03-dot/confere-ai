import CollectionsPage from '../../src/views/CollectionsPage'
import { listActiveCollections } from '../../src/lib/catalog'
import { buildPageMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Coleções',
  description:
    'Curadoria Terra & Estilo — campanhas com identidade, presença e acabamento premium.',
  path: '/colecoes',
})

export default async function ColecoesPage() {
  const collections = await listActiveCollections()
  return <CollectionsPage collections={collections} />
}
