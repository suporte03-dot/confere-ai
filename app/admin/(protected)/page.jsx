import Link from 'next/link'
import { fetchProductsForAdmin } from '../../../src/lib/admin/products'
import { fetchCollectionsForAdmin } from '../../../src/lib/admin/taxonomies'
import { fetchStockAlerts } from '../../../src/lib/admin/stock-alerts'

export default async function AdminHomePage() {
  let products = []
  let collections = []
  let stock = { summary: { out: 0, critical: 0, low: 0, total: 0 }, alerts: [] }

  try {
    ;[products, collections, stock] = await Promise.all([
      fetchProductsForAdmin(),
      fetchCollectionsForAdmin(),
      fetchStockAlerts(),
    ])
  } catch {
    // Keep empty dashboard rather than crashing the shell.
  }

  const activeProducts = products.filter((item) => item.active).length
  const activeCollections = collections.filter((item) => item.active).length
  const attention = stock.summary.total
  const previewAlerts = (stock.alerts || []).slice(0, 4)

  return (
    <>
      <section className="admin-kpis" aria-label="Indicadores da loja">
        <article>
          <span>Produtos</span>
          <strong>{activeProducts}</strong>
          <em>produtos ativos</em>
        </article>
        <article>
          <span>Estoque</span>
          <strong>{attention}</strong>
          <em>{attention === 1 ? 'peça precisa de atenção' : 'peças precisam de atenção'}</em>
        </article>
        <article>
          <span>Coleções</span>
          <strong>{activeCollections}</strong>
          <em>coleções ativas</em>
        </article>
      </section>

      <h2 className="admin-block-title">Gerenciar</h2>
      <div className="admin-shortcuts">
        <article>
          <h3>Produtos</h3>
          <p>Gerencie peças, fotos, preços, tamanhos e estoque.</p>
          <Link href="/admin/produtos" className="admin-btn">
            Gerenciar produtos
          </Link>
        </article>
        <article>
          <h3>Coleções</h3>
          <p>Organize os produtos por coleção e destaque.</p>
          <Link href="/admin/colecoes" className="admin-btn admin-btn--ghost">
            Gerenciar coleções
          </Link>
        </article>
        <article>
          <h3>Categorias</h3>
          <p>Administre masculino, feminino, acessórios e outras categorias.</p>
          <Link href="/admin/categorias" className="admin-btn admin-btn--ghost">
            Gerenciar categorias
          </Link>
        </article>
      </div>

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
        {previewAlerts.length ? (
          <ul className="admin-attention__list">
            {previewAlerts.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.productName}</strong>
                  <span>
                    {[item.color, item.size && `Tam. ${item.size}`, item.label]
                      .filter(Boolean)
                      .join(' · ')}
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
        ) : (
          <p className="admin-muted">Nenhum alerta de estoque no momento.</p>
        )}
      </section>
    </>
  )
}
