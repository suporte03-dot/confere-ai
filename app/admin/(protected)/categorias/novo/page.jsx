import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { signOutAdmin } from '../../../actions'
import CategoryEditor from '../CategoryEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewCategoryPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>Faça login com um perfil administrador para cadastrar categorias.</p>
          <div className="admin-actions">
            <Link href="/admin/login" className="admin-btn">
              Ir para login
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
          <p className="admin-kicker">Nova categoria</p>
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
        <CategoryEditor mode="create" />
      </section>
    </div>
  )
}
