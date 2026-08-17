import Link from 'next/link'
import { signOutAdmin } from '../actions'

export default function AdminHomePage() {
  return (
    <div className="admin-shell">
      <p className="admin-brand">
        Terra &amp; <span>Estilo</span>
      </p>
      <p className="admin-kicker">Painel administrativo</p>

      <section className="admin-panel">
        <h1>Admin</h1>
        <p>Gerencie o catálogo e as seções da loja.</p>

        <ul className="admin-nav">
          <li>
            <Link className="admin-nav-item" href="/admin/produtos">
              Produtos
            </Link>
          </li>
          <li>
            <Link className="admin-nav-item" href="/admin/colecoes">
              Coleções
            </Link>
          </li>
          <li>
            <Link className="admin-nav-item" href="/admin/categorias">
              Categorias
            </Link>
          </li>
        </ul>

        <div className="admin-actions">
          <form action={signOutAdmin}>
            <button type="submit" className="admin-btn admin-btn--ghost">
              Sair
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
