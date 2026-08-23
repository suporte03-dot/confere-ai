import Link from 'next/link'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchCollectionsForAdmin } from '../../../../src/lib/admin/taxonomies'
import AdminDenied from '../../components/AdminDenied'
import AdminPageHeader from '../../components/AdminPageHeader'
import CollectionsListClient from './CollectionsListClient'
import { AdminIcon } from '../../components/AdminIcons'
import HelpButton from '../../components/help/HelpButton'

export const dynamic = 'force-dynamic'

export default async function AdminCollectionsPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar coleções.</p>
      </AdminDenied>
    )
  }

  let collections = []
  let loadError = ''

  try {
    collections = await fetchCollectionsForAdmin()
  } catch {
    loadError = 'Não foi possível carregar as coleções. Tente novamente.'
  }

  return (
    <>
      <AdminPageHeader
        title="Coleções"
        description="Gerencie suas coleções, destaques e a ordem de exibição na loja."
        actions={
          <>
            <HelpButton topic="colecoes" />
            <Link href="/admin/colecoes/novo" className="admin-btn">
              <AdminIcon name="plus" />
              Nova coleção
            </Link>
          </>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError ? <CollectionsListClient collections={collections} /> : null}
    </>
  )
}
