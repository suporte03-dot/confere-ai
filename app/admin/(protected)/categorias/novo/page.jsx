import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import CategoryEditor from '../CategoryEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewCategoryPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para cadastrar categorias.</p>
      </AdminDenied>
    )
  }

  return (
    <>
      <AdminPageHeader
        title="Nova categoria"
        actions={
          <Link href="/admin/categorias" className="admin-btn admin-btn--ghost">
            Cancelar
          </Link>
        }
      />
      <CategoryEditor mode="create" />
    </>
  )
}
