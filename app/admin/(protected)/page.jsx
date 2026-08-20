import Link from 'next/link'
import { fetchProductsForAdmin } from '../../../src/lib/admin/products'
import { fetchCollectionsForAdmin } from '../../../src/lib/admin/taxonomies'
import { fetchStockAlerts } from '../../../src/lib/admin/stock-alerts'
import { formatVariantLabel } from '../../../src/lib/admin/stock'
import { AdminIcon } from '../components/AdminIcons'

export default async function AdminHomePage() {
  let products = []
  let collections = []
  let stock = { summary: { out: 0, critical: 0, low: 0, total: 0 }, alerts: [] }
  let loadError = false

  try {
    ;[products, collections, stock] = await Promise.all([
      fetchProductsForAdmin(),
      fetchCollectionsForAdmin(),
      fetchStockAlerts(),
    ])
  } catch {
    loadError = true
  }

  const activeProducts = products.filter((item) => item.active).length
  const activeCollections = collections.filter((item) => item.active).length
  const attention = stock.summary?.total || 0
  const previewAlerts = (stock.alerts || []).slice(0, 4)

  return (
    <>
      {loadError ? (
        <p className="admin-error" role="alert">
          Não foi possível carregar os indicadores do painel. Atualize a página ou tente novamente.
        </p>
      ) : null}
      <section className="admin-kpis" aria-label="Indicadores da loja">
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="products" />
          </span>
          <div>
            <span>Produtos</span>
            <strong>{activeProducts}</strong>
            <em>produtos ativos</em>
          </div>
          <Link href="/admin/produtos" className="admin-kpis__go" aria-label="Ir para produtos">
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="stock" />
          </span>
          <div>
            <span>Estoque</span>
            <strong>{attention}</strong>
            <em>{attention === 1 ? 'peça precisa de atenção' : 'peças precisam de atenção'}</em>
          </div>
          <Link href="/admin/estoque" className="admin-kpis__go" aria-label="Ir para estoque">
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="tag" />
          </span>
          <div>
            <span>Coleções</span>
            <strong>{activeCollections}</strong>
            <em>coleções ativas</em>
          </div>
          <Link href="/admin/colecoes" className="admin-kpis__go" aria-label="Ir para coleções">
            <AdminIcon name="arrow" />
          </Link>
        </article>
      </section>

      <h2 className="admin-block-title">Gerenciar</h2>
      <div className="admin-shortcuts">
        <article>
          <span className="admin-shortcuts__icon" aria-hidden="true">
            <AdminIcon name="products" />
          </span>
          <h3>Produtos</h3>
          <p>Gerencie peças, fotos, preços, tamanhos e estoque.</p>
          <Link href="/admin/produtos" className="admin-btn">
            Gerenciar produtos
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-shortcuts__icon" aria-hidden="true">
            <AdminIcon name="tag" />
          </span>
          <h3>Coleções</h3>
          <p>Organize os produtos por coleção e destaque.</p>
          <Link href="/admin/colecoes" className="admin-btn">
            Gerenciar coleções
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-shortcuts__icon" aria-hidden="true">
            <AdminIcon name="stock" />
          </span>
          <h3>Categorias</h3>
          <p>Administre masculino, feminino, acessórios e outras categorias.</p>
          <Link href="/admin/categorias" className="admin-btn">
            Gerenciar categorias
            <AdminIcon name="arrow" />
          </Link>
        </article>
      </div>

      {previewAlerts.length ? (
        <section className="admin-attention">
          <div className="admin-page-header">
            <div>
              <h2>Estoque que precisa da sua atenção</h2>
              <p>Variantes esgotadas, críticas ou baixas.</p>
            </div>
            <Link href="/admin/estoque" className="admin-btn admin-btn--ghost">
              Ver estoque
            </Link>
          </div>
          <ul className="admin-attention__list">
            {previewAlerts.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.productName}</strong>
                  <span>
                    {[formatVariantLabel(item), item.label].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <Link
                  href={`/admin/produtos/${item.productId}?variante=${item.id}`}
                  className="admin-link-btn"
                >
                  Ver produto
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
