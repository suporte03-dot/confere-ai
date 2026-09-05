import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { fetchRootCategoriesForAdmin } from '../../../../../src/lib/admin/taxonomies'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import HelpButton from '../../../components/help/HelpButton'
import CategoryEditor from '../CategoryEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewCategoryPage({ searchParams }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para cadastrar categorias.</p>
      </AdminDenied>
    )
  }

  const resolvedSearch = await searchParams
  const requestedParentId = String(resolvedSearch?.parentId || '').trim()

  let parentOptions = []
  try {
    parentOptions = await fetchRootCategoriesForAdmin()
  } catch {
    parentOptions = []
  }

  const parentMatch = parentOptions.find((item) => item.id === requestedParentId)
  const initialParentId = parentMatch?.id || ''
  const parentName = parentMatch?.name || ''

  return (
    <>
      <AdminPageHeader
        title={initialParentId ? 'Nova subcategoria' : 'Nova categoria'}
        description={
          initialParentId
            ? `Vinculada a ${parentName}`
            : undefined
        }
        actions={
          <>
            <HelpButton topic="categorias" showFirstVisit={false} />
            <Link href="/admin/categorias" className="admin-btn admin-btn--ghost">
              Cancelar
            </Link>
          </>
        }
      />
      <CategoryEditor
        mode="create"
        parentOptions={parentOptions}
        initialParentId={initialParentId}
        lockParent={Boolean(initialParentId)}
      />
    </>
  )
}
