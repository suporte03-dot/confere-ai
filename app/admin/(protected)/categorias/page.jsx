import Link from 'next/link'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchCategoriesForAdmin } from '../../../../src/lib/admin/taxonomies'
import { signOutAdmin } from '../../actions'
import CategoriesListClient from './CategoriesListClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>Faça login com um perfil administrador para gerenciar categorias.</p>
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
  let loadError = ''

  try {
    categories = await fetchCategoriesForAdmin()
  } catch {
    loadError = 'Não foi possível carregar as categorias. Tente novamente.'
  }

  return (
    <div className="admin-shell admin-shell--wide">
      <div className="admin-topbar">
        <div>
          <p className="admin-brand">
            Terra &amp; <span>Estilo</span>
          </p>
          <p className="admin-kicker">Categorias</p>
        </div>
        <div className="admin-actions admin-actions--compact">
          <Link href="/admin" className="admin-btn admin-btn--ghost">
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
        <div className="admin-panel__head">
          <div>
            <h1>Categorias</h1>
            <p>Organize o catálogo com categorias ativas e ordenadas.</p>
          </div>
          <Link href="/admin/categorias/novo" className="admin-btn">
            + Nova categoria
          </Link>
        </div>

        {loadError ? <p className="admin-error">{loadError}</p> : null}
        {!loadError ? <CategoriesListClient categories={categories} /> : null}
      </section>
    </div>
  )
}
