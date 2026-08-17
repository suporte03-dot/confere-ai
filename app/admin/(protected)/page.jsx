import Link from 'next/link'
import { signOutAdmin } from '../actions'
import { fetchStockAlerts } from '../../../src/lib/admin/stock-alerts'

export default async function AdminHomePage() {
  const stock = await fetchStockAlerts()
  const { summary } = stock

  return (
    <div className="admin-shell">
      <p className="admin-brand">
        Terra &amp; <span>Estilo</span>
      </p>
      <p className="admin-kicker">Painel administrativo</p>

      <section className="admin-panel">
        <h1>Admin</h1>
        <p>Gerencie o catálogo e as seções da loja.</p>

        <div className="admin-stock-summary" aria-label="Resumo de estoque">
          <article className="admin-stock-summary__card admin-stock-summary__card--out">
            <strong>{summary.out}</strong>
            <span>esgotados</span>
          </article>
          <article className="admin-stock-summary__card admin-stock-summary__card--critical">
            <strong>{summary.critical}</strong>
            <span>críticos</span>
          </article>
          <article className="admin-stock-summary__card admin-stock-summary__card--low">
            <strong>{summary.low}</strong>
            <span>baixos</span>
          </article>
        </div>

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
