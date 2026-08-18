import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { fetchCategoryById } from '../../../../../src/lib/admin/taxonomies'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import CategoryEditor from '../CategoryEditor'

export const dynamic = 'force-dynamic'

export default async function AdminCategoryDetailPage({ params }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar categorias.</p>
      </AdminDenied>
    )
  }

  const resolvedParams = await params
  const id = resolvedParams?.id

  let category = null
  let loadError = ''

  try {
    category = await fetchCategoryById(id)
  } catch {
    loadError = 'Não foi possível carregar a categoria.'
  }

  if (!loadError && !category) {
    return (
      <>
        <AdminPageHeader title="Categoria não encontrada" />
        <Link href="/admin/categorias" className="admin-btn">
          Voltar à listagem
        </Link>
      </>
    )
  }

  return (
    <>
      <AdminPageHeader
        title="Editar categoria"
        description={category?.name}
        actions={
          <Link href="/admin/categorias" className="admin-btn admin-btn--ghost">
            Cancelar
          </Link>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError && category ? (
        <CategoryEditor
          key={`${category.id}-${category.updatedAt}`}
          mode="edit"
          category={category}
        />
      ) : null}
    </>
  )
}
