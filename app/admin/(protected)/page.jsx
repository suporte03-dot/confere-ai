import Link from 'next/link'
import { fetchProductsForAdmin } from '../../../src/lib/admin/products'
import { fetchCollectionsForAdmin } from '../../../src/lib/admin/taxonomies'
import { fetchStockAlerts } from '../../../src/lib/admin/stock-alerts'
import { fetchOrderDashboardStats } from '../../../src/lib/orders/service'
import { formatBRL } from '../../../src/lib/admin/format'
import { formatVariantLabel } from '../../../src/lib/admin/stock'
import { AdminIcon } from '../components/AdminIcons'
import AdminPageHeader from '../components/AdminPageHeader'
import HelpButton from '../components/help/HelpButton'

const EMPTY_ORDER_STATS = {
  pendingPayment: 0,
  paid: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  confirmedSalesTotal: 0,
}

export default async function AdminHomePage() {
  let products = []
  let collections = []
  let stock = { summary: { out: 0, critical: 0, low: 0, total: 0 }, alerts: [] }
  let orderStats = EMPTY_ORDER_STATS
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

  try {
    orderStats = await fetchOrderDashboardStats()
  } catch {
    orderStats = EMPTY_ORDER_STATS
  }

  const activeProducts = products.filter((item) => item.active).length
  const activeCollections = collections.filter((item) => item.active).length
  const attention = stock.summary?.total || 0
  const previewAlerts = (stock.alerts || []).slice(0, 4)

  return (
    <>
      <AdminPageHeader
        title="Visão Geral"
        description="Acompanhe indicadores e atalhos da operação da loja."
        actions={<HelpButton topic="overview" />}
      />
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
            <em>produtos publicados</em>
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
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="orders" />
          </span>
          <div>
            <span>Aguardando pagamento</span>
            <strong>{orderStats.pendingPayment}</strong>
            <em>pedidos pendentes</em>
          </div>
          <Link href="/admin/pedidos?status=pending_payment" className="admin-kpis__go" aria-label="Ir para pedidos">
            <AdminIcon name="arrow" />
          </Link>
        </article>
      </section>

      <section className="admin-kpis" aria-label="Indicadores de pedidos">
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="check" />
          </span>
          <div>
            <span>Pagos</span>
            <strong>{orderStats.paid}</strong>
            <em>confirmados</em>
          </div>
          <Link href="/admin/pedidos?status=paid" className="admin-kpis__go" aria-label="Pedidos pagos">
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="list" />
          </span>
          <div>
            <span>Em preparação</span>
            <strong>{orderStats.processing}</strong>
            <em>pedidos</em>
          </div>
          <Link href="/admin/pedidos?status=processing" className="admin-kpis__go" aria-label="Pedidos em preparação">
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="arrow" />
          </span>
          <div>
            <span>Enviados</span>
            <strong>{orderStats.shipped}</strong>
            <em>em trânsito</em>
          </div>
          <Link href="/admin/pedidos?status=shipped" className="admin-kpis__go" aria-label="Pedidos enviados">
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="orders" />
          </span>
          <div>
            <span>Vendas confirmadas</span>
            <strong>{formatBRL(orderStats.confirmedSalesTotal)}</strong>
            <em>total pago</em>
          </div>
          <Link href="/admin/pedidos" className="admin-kpis__go" aria-label="Ver todos os pedidos">
            <AdminIcon name="arrow" />
          </Link>
        </article>
      </section>

      <h2 className="admin-block-title">Gerenciar</h2>
      <div className="admin-shortcuts">
        <article>
          <span className="admin-shortcuts__icon" aria-hidden="true">
            <AdminIcon name="orders" />
          </span>
          <h3>Pedidos</h3>
          <p>Confirme pagamentos e acompanhe preparação e envio.</p>
          <Link href="/admin/pedidos" className="admin-btn">
            Gerenciar pedidos
            <AdminIcon name="arrow" />
          </Link>
        </article>
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
            <AdminIcon name="settings" />
          </span>
          <h3>Configurações</h3>
          <p>Pix, contatos e parâmetros operacionais da loja.</p>
          <Link href="/admin/configuracoes" className="admin-btn">
            Abrir configurações
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
