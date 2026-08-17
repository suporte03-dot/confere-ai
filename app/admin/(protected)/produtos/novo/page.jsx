import Link from 'next/link'
import {
  assertAdminAccess,
  fetchActiveTaxonomies,
} from '../../../../../src/lib/admin/products'
import { isAiConfigured } from '../../../../../src/lib/admin/ai-config'
import { signOutAdmin } from '../../../actions'
import ProductEditor from '../ProductEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewProductPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>Faça login com um perfil administrador para cadastrar produtos.</p>
          <div className="admin-actions">
            <Link href="/admin/login" className="admin-btn">
              Ir para login
            </Link>
          </div>
        </section>
      </div>
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
    <div className="admin-shell admin-shell--wide">
      <div className="admin-topbar">
        <div>
          <p className="admin-brand">
            Terra &amp; <span>Estilo</span>
          </p>
          <p className="admin-kicker">Novo produto</p>
        </div>
        <div className="admin-actions admin-actions--compact">
          <Link href="/admin/produtos" className="admin-btn admin-btn--ghost">
            Voltar
          </Link>
          <form action={signOutAdmin}>
            <button type="submit" className="admin-btn admin-btn--ghost">
              Sair
            </button>
          </form>
        </div>
      </div>

      <section className="admin-panel">
        {loadError ? <p className="admin-error">{loadError}</p> : null}
        <ProductEditor
          mode="create"
          categories={categories}
          collections={collections}
          aiEnabled={isAiConfigured()}
        />
      </section>
    </div>
  )
}
