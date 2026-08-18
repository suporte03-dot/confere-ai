import Link from 'next/link'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchCategoriesForAdmin } from '../../../../src/lib/admin/taxonomies'
import AdminDenied from '../../components/AdminDenied'
import AdminPageHeader from '../../components/AdminPageHeader'
import CategoriesListClient from './CategoriesListClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar categorias.</p>
      </AdminDenied>
    )
  }

  let categories = []
  let loadError = ''

  try {
    categories = await fetchCategoriesForAdmin()
  } catch {
    loadError = 'Não foi possível carregar as categorias. Tente novamente.'
  }

  return (
    <>
      <AdminPageHeader
        title="Categorias"
        description="Organize o catálogo com categorias ativas e ordenadas."
        actions={
          <Link href="/admin/categorias/novo" className="admin-btn">
            Nova categoria
          </Link>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError ? <CategoriesListClient categories={categories} /> : null}
    </>
  )
}
