import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import HelpButton from '../../../components/help/HelpButton'
import CollectionEditor from '../CollectionEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewCollectionPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para cadastrar coleções.</p>
      </AdminDenied>
    )
  }

  return (
    <>
      <AdminPageHeader
        title="Nova coleção"
        actions={
          <>
            <HelpButton topic="colecoes" showFirstVisit={false} />
            <Link href="/admin/colecoes" className="admin-btn admin-btn--ghost">
              Cancelar
            </Link>
          </>
        }
      />
      <CollectionEditor mode="create" />
    </>
  )
}
