import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { fetchCollectionById } from '../../../../../src/lib/admin/taxonomies'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import CollectionEditor from '../CollectionEditor'

export const dynamic = 'force-dynamic'

export default async function AdminCollectionDetailPage({ params }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar coleções.</p>
      </AdminDenied>
    )
  }

  const resolvedParams = await params
  const id = resolvedParams?.id

  let collection = null
  let loadError = ''

  try {
    collection = await fetchCollectionById(id)
  } catch {
    loadError = 'Não foi possível carregar a coleção.'
  }

  if (!loadError && !collection) {
    return (
      <>
        <AdminPageHeader title="Coleção não encontrada" />
        <Link href="/admin/colecoes" className="admin-btn">
          Voltar à listagem
        </Link>
      </>
    )
  }

  return (
    <>
      <AdminPageHeader
        title="Editar coleção"
        description={collection?.name}
        actions={
          <Link href="/admin/colecoes" className="admin-btn admin-btn--ghost">
            Cancelar
          </Link>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError && collection ? (
        <CollectionEditor
          key={`${collection.id}-${collection.updatedAt}`}
          mode="edit"
          collection={collection}
        />
      ) : null}
    </>
  )
}
