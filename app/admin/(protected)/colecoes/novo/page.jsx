import Link from 'next/link'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { signOutAdmin } from '../../../actions'
import CollectionEditor from '../CollectionEditor'

export const dynamic = 'force-dynamic'

export default async function AdminNewCollectionPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>Faça login com um perfil administrador para cadastrar coleções.</p>
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
          <p className="admin-kicker">Nova coleção</p>
        </div>
        <div className="admin-actions admin-actions--compact">
          <Link href="/admin/colecoes" className="admin-btn admin-btn--ghost">
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
        <CollectionEditor mode="create" />
      </section>
    </div>
  )
}
