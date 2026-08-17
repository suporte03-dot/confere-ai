import CollectionsPage from '../../src/views/CollectionsPage'
import { listActiveCollections } from '../../src/lib/catalog'

export const metadata = {
  title: 'Coleções — Terra & Estilo',
  description:
    'Curadoria Terra & Estilo — campanhas com identidade, presença e acabamento premium.',
}

export default async function ColecoesPage() {
  const collections = await listActiveCollections()
  return <CollectionsPage collections={collections} />
}
