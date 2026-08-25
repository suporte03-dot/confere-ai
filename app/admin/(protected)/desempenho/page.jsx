import Link from 'next/link'
import { Suspense } from 'react'
import {
  emptyPerformanceDashboard,
  fetchPerformanceDashboard,
} from '../../../../src/lib/admin/performance'
import { formatBRL, formatDateTime } from '../../../../src/lib/admin/format'
import { orderStatusLabel } from '../../../../src/lib/orders/status'
import { AdminIcon } from '../../components/AdminIcons'
import AdminPageHeader from '../../components/AdminPageHeader'
import PerformancePeriodSelector from './PerformancePeriodSelector'
import { CategoryBars, RevenueChart, StatusChart } from './PerformanceCharts'

export const dynamic = 'force-dynamic'

function statusBadgeClass(status) {
  if (status === 'paid' || status === 'delivered') return 'admin-badge--ok'
  if (status === 'cancelled' || status === 'expired') return 'admin-badge--off'
  if (status === 'pending_payment') return 'admin-badge--low'
  return 'admin-badge--gold'
}

function ComparisonHint({ comparison }) {
  if (!comparison || comparison.pct == null) {
    return <em className="admin-perf-delta admin-perf-delta--flat">{comparison?.label}</em>
  }
  return (
    <em className={`admin-perf-delta admin-perf-delta--${comparison.direction}`}>
      {comparison.direction === 'up' ? '↑' : comparison.direction === 'down' ? '↓' : '→'}{' '}
      {comparison.label} vs. período anterior
    </em>
  )
}

function PeriodSelectorFallback() {
  return <div className="admin-skel admin-skel--copy" aria-hidden="true" />
}

export default async function AdminDesempenhoPage({ searchParams }) {
  const params = (await searchParams) || {}
  let data = emptyPerformanceDashboard(params)
  let loadError = false

  try {
    data = await fetchPerformanceDashboard(params)
  } catch (error) {
    console.error('[admin/desempenho] falha ao carregar indicadores', error)
    loadError = true
    data = emptyPerformanceDashboard(params)
  }

  const { kpis, comparison, byStatus, today, stock } = data
  const showAllTop = params.top === 'all'

  function desempenhoHref(extra = {}) {
    const qs = new URLSearchParams()
    qs.set('periodo', data.period.key)
    if (data.period.key === 'custom') {
      if (data.period.fromInput) qs.set('de', data.period.fromInput)
      if (data.period.toInput) qs.set('ate', data.period.toInput)
    }
    Object.entries(extra).forEach(([key, value]) => {
      if (value == null || value === '') qs.delete(key)
      else qs.set(key, value)
    })
    const str = qs.toString()
    return str ? `/admin/desempenho?${str}` : '/admin/desempenho'
  }

  return (
    <div className="admin-perf">
      <AdminPageHeader
        title="Desempenho da Loja"
        description="Acompanhe vendas, pedidos, produtos e estoque em tempo real."
        actions={
          <Suspense fallback={<PeriodSelectorFallback />}>
            <PerformancePeriodSelector
              periodKey={data.period.key}
              fromInput={data.period.fromInput}
              toInput={data.period.toInput}
            />
          </Suspense>
        }
      />

      <p className="admin-perf-period-label">
        <AdminIcon name="monitor" />
        <span>{data.period.label}</span>
      </p>

      {loadError ? (
        <p className="admin-error" role="alert">
          Não foi possível carregar os indicadores de desempenho. Atualize a página ou tente
          novamente.
        </p>
      ) : null}

      <section className="admin-kpis admin-perf-kpis" aria-label="Indicadores principais">
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="orders" />
          </span>
          <div>
            <span>Faturamento</span>
            <strong>{formatBRL(kpis.revenue)}</strong>
            <ComparisonHint comparison={comparison.revenue} />
          </div>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="list" />
          </span>
          <div>
            <span>Pedidos</span>
            <strong>{kpis.orderCount}</strong>
            <ComparisonHint comparison={comparison.orders} />
          </div>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="tag" />
          </span>
          <div>
            <span>Ticket médio</span>
            <strong>{formatBRL(kpis.ticketAverage)}</strong>
            <ComparisonHint comparison={comparison.ticket} />
          </div>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="products" />
          </span>
          <div>
            <span>Itens vendidos</span>
            <strong>{kpis.itemsSold}</strong>
            <ComparisonHint comparison={comparison.items} />
          </div>
        </article>
      </section>

      <section className="admin-kpis admin-perf-ops" aria-label="Pedidos aguardando ação">
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="bell" />
          </span>
          <div>
            <span>Aguardando pagamento</span>
            <strong>{byStatus.pending_payment || 0}</strong>
            <em>{byStatus.pending_payment === 1 ? 'pedido' : 'pedidos'}</em>
          </div>
          <Link
            href="/admin/pedidos?status=pending_payment"
            className="admin-kpis__go"
            aria-label="Ver pedidos aguardando pagamento"
          >
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="check" />
          </span>
          <div>
            <span>Em preparação</span>
            <strong>{byStatus.processing || 0}</strong>
            <em>
              <span className="admin-badge admin-badge--gold">Em preparação</span>
            </em>
          </div>
          <Link
            href="/admin/pedidos?status=processing"
            className="admin-kpis__go"
            aria-label="Ver pedidos em preparação"
          >
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="arrow" />
          </span>
          <div>
            <span>Enviados</span>
            <strong>{byStatus.shipped || 0}</strong>
            <em>
              <span className="admin-badge admin-badge--gold">Enviado</span>
            </em>
          </div>
          <Link
            href="/admin/pedidos?status=shipped"
            className="admin-kpis__go"
            aria-label="Ver pedidos enviados"
          >
            <AdminIcon name="arrow" />
          </Link>
        </article>
        <article>
          <span className="admin-kpis__icon" aria-hidden="true">
            <AdminIcon name="close" />
          </span>
          <div>
            <span>Cancelados</span>
            <strong>{byStatus.cancelled || 0}</strong>
            <em>
              <span className="admin-badge admin-badge--off">Cancelado</span>
            </em>
          </div>
          <Link
            href="/admin/pedidos?status=cancelled"
            className="admin-kpis__go"
            aria-label="Ver pedidos cancelados"
          >
            <AdminIcon name="arrow" />
          </Link>
        </article>
      </section>

      <section className="admin-perf-today" aria-label="Indicadores de hoje">
        <h2 className="admin-block-title">Hoje</h2>
        <div className="admin-perf-today__grid">
          <article>
            <span>Pedidos hoje</span>
            <strong>{today.orderCount}</strong>
          </article>
          <article>
            <span>Vendas confirmadas</span>
            <strong>{today.paidCount}</strong>
          </article>
          <article>
            <span>Faturamento hoje</span>
            <strong>{formatBRL(today.revenue)}</strong>
          </article>
          <article>
            <span>Itens vendidos</span>
            <strong>{today.itemsSold}</strong>
          </article>
        </div>
      </section>

      <div className="admin-grid-2 admin-perf-grid">
        <RevenueChart series={data.dailyRevenue} />
        <StatusChart byStatus={byStatus} />
      </div>

      <div className="admin-grid-2 admin-perf-grid">
        <section className="admin-perf-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Produtos mais vendidos</h2>
              <p>Somente pedidos com pagamento confirmado.</p>
            </div>
            {data.topProductsTotal > 5 ? (
              <Link
                href={showAllTop ? desempenhoHref() : desempenhoHref({ top: 'all' })}
                className="admin-btn admin-btn--ghost"
              >
                {showAllTop ? 'Ver top 5' : 'Ver todos'}
              </Link>
            ) : null}
          </div>
          {!data.topProducts.length ? (
            <p className="admin-perf-empty">Ainda não há vendas neste período.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-table--compact">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd.</th>
                    <th>Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((item) => (
                    <tr key={item.key}>
                      <td>
                        <div className="admin-perf-product">
                          {item.coverUrl ? (
                            <img src={item.coverUrl} alt="" width={40} height={40} loading="lazy" />
                          ) : (
                            <span className="admin-perf-product__ph" aria-hidden="true" />
                          )}
                          <div>
                            <strong>{item.productName}</strong>
                            {item.variantLabel ? <span>{item.variantLabel}</span> : null}
                          </div>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatBRL(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-perf-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Estoque em atenção</h2>
              <p>
                Limiar: {stock.threshold}{' '}
                {stock.threshold === 1 ? 'unidade' : 'unidades'} (configurações da loja).
              </p>
            </div>
            <Link href="/admin/estoque" className="admin-btn admin-btn--ghost">
              Gerenciar estoque
            </Link>
          </div>

          <div className="admin-perf-stock-summary">
            <Link href="/admin/estoque" className="admin-perf-stock-pill">
              <strong>{stock.outOfStockCount}</strong>
              <span>
                {stock.outOfStockCount === 1
                  ? 'variante sem estoque'
                  : 'variantes sem estoque'}
              </span>
            </Link>
          </div>

          {!stock.lowStock.length ? (
            <p className="admin-perf-empty">Nenhum item abaixo do limiar de estoque.</p>
          ) : (
            <ul className="admin-attention__list">
              {stock.lowStock.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.productName}</strong>
                    <span>
                      {item.variantLabel} — {item.stock}{' '}
                      {item.stock === 1 ? 'unidade' : 'unidades'}
                    </span>
                  </div>
                  <span className={`admin-badge admin-badge--${item.status}`}>{item.label}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="admin-grid-2 admin-perf-grid">
        <CategoryBars rows={data.categories} />

        <section className="admin-perf-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Desempenho das coleções</h2>
              <p>Itens vendidos e faturamento por coleção.</p>
            </div>
          </div>
          {!data.collections.length ? (
            <p className="admin-perf-empty">
              Ainda não há vendas vinculadas a coleções neste período.
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table admin-table--compact">
                <thead>
                  <tr>
                    <th>Coleção</th>
                    <th>Itens</th>
                    <th>Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.collections.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>{row.quantity}</td>
                      <td>{formatBRL(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="admin-perf-panel">
        <div className="admin-panel__head">
          <div>
            <h2>Últimos pedidos</h2>
            <p>Pedidos do período selecionado — sem dados sensíveis.</p>
          </div>
          <Link href="/admin/pedidos" className="admin-btn admin-btn--ghost">
            Ver todos
          </Link>
        </div>
        {!data.recentOrders.length ? (
          <p className="admin-perf-empty">Ainda não há pedidos neste período.</p>
        ) : (
          <>
            <div className="admin-table-wrap admin-perf-recent-desktop">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customerName}</td>
                      <td>{formatBRL(order.total)}</td>
                      <td>
                        <span className={`admin-badge ${statusBadgeClass(order.status)}`}>
                          {orderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>{formatDateTime(order.createdAt)}</td>
                      <td>
                        <Link href={`/admin/pedidos/${order.id}`} className="admin-link-btn">
                          Abrir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-card-list admin-perf-recent-mobile">
              {data.recentOrders.map((order) => (
                <article key={order.id} className="admin-card-item">
                  <header>
                    <strong>{order.orderNumber}</strong>
                    <span className={`admin-badge ${statusBadgeClass(order.status)}`}>
                      {orderStatusLabel(order.status)}
                    </span>
                  </header>
                  <p>
                    {order.customerName} · {formatBRL(order.total)}
                  </p>
                  <p className="admin-muted">{formatDateTime(order.createdAt)}</p>
                  <Link href={`/admin/pedidos/${order.id}`} className="admin-link-btn">
                    Abrir pedido
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
