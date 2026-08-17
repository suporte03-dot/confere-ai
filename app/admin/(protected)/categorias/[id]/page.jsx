import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { fetchCategoryById } from '../../../../../src/lib/admin/taxonomies'
import { signOutAdmin } from '../../../actions'
import CategoryEditor from '../CategoryEditor'

export const dynamic = 'force-dynamic'

export default async function AdminCategoryDetailPage({ params }) {
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
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel">
          <h1>Categoria não encontrada</h1>
          <p>O item solicitado não existe ou não está disponível.</p>
          <div className="admin-actions">
            <Link href="/admin/categorias" className="admin-btn">
              Voltar à listagem
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="admin-shell admin-shell--wide">
      <div className="admin-topbar">
        <div>
          <p className="admin-brand">
            Terra &amp; <span>Estilo</span>
          </p>
          <p className="admin-kicker">Editar categoria</p>
        </div>
        <div className="admin-actions admin-actions--compact">
          <Link href="/admin/categorias" className="admin-btn admin-btn--ghost">
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
        {!loadError && category ? (
          <CategoryEditor
            key={`${category.id}-${category.updatedAt}`}
            mode="edit"
            category={category}
          />
        ) : null}
      </section>
    </div>
  )
}
