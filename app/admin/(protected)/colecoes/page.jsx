import Link from 'next/link'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchCollectionsForAdmin } from '../../../../src/lib/admin/taxonomies'
import { signOutAdmin } from '../../actions'
import CollectionsListClient from './CollectionsListClient'

export const dynamic = 'force-dynamic'

export default async function AdminCollectionsPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>Faça login com um perfil administrador para gerenciar coleções.</p>
          <div className="admin-actions">
            <Link href="/admin/login" className="admin-btn">
              Ir para login
            </Link>
          </div>
        </section>
      </div>
    )
  }

  let collections = []
  let loadError = ''

  try {
    collections = await fetchCollectionsForAdmin()
  } catch {
    loadError = 'Não foi possível carregar as coleções. Tente novamente.'
  }

  return (
    <div className="admin-shell admin-shell--wide">
      <div className="admin-topbar">
        <div>
          <p className="admin-brand">
            Terra &amp; <span>Estilo</span>
          </p>
          <p className="admin-kicker">Coleções</p>
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
            <h1>Coleções</h1>
            <p>Gerencie coleções, destaques e a ordem de exibição.</p>
          </div>
          <Link href="/admin/colecoes/novo" className="admin-btn">
            + Nova coleção
          </Link>
        </div>

        {loadError ? <p className="admin-error">{loadError}</p> : null}
        {!loadError ? (
          <CollectionsListClient collections={collections} />
        ) : null}
      </section>
    </div>
  )
}
