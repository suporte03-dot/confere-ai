import Link from 'next/link'
import { assertAdminAccess, fetchActiveTaxonomies } from '../../../../../src/lib/admin/products'
import { isAiConfigured } from '../../../../../src/lib/admin/ai-config'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import HelpButton from '../../../components/help/HelpButton'
import ProductEditor from '../ProductEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewProductPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para cadastrar produtos.</p>
      </AdminDenied>
    )
  }

  let categories = []
  let collections = []
  let loadError = ''

  try {
    const taxonomies = await fetchActiveTaxonomies()
    categories = taxonomies.categories
    collections = taxonomies.collections
  } catch {
    loadError = 'Não foi possível carregar categorias e coleções.'
  }

  return (
    <>
      <AdminPageHeader
        title="Novo produto"
        description="Cadastre a peça, revise as sugestões e salve quando estiver pronto."
        actions={
          <>
            <HelpButton topic="produtos" showFirstVisit={false} />
            <Link href="/admin/produtos" className="admin-btn admin-btn--ghost">
              Cancelar
            </Link>
          </>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      <ProductEditor
        mode="create"
        categories={categories}
        collections={collections}
        aiEnabled={isAiConfigured()}
      />
    </>
  )
}
