'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  STOCK_STATUS_LABEL,
  filterStockAlerts,
  formatVariantLabel,
} from '../../../../src/lib/admin/stock'
import { AdminIcon } from '../../components/AdminIcons'
import AdjustStockDialog from './AdjustStockDialog'

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'out', label: 'Esgotados' },
  { id: 'critical', label: 'Críticos' },
  { id: 'low', label: 'Estoque baixo' },
]

const STATS = [
  { key: 'out', label: 'Esgotados', icon: 'out' },
  { key: 'critical', label: 'Estoque crítico', icon: 'critical' },
  { key: 'low', label: 'Estoque baixo', icon: 'low' },
]

export default function StockMonitor({ alerts, summary, loadError }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [deferredQuery, setDeferredQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [adjusting, setAdjusting] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDeferredQuery(query), 180)
    return () => window.clearTimeout(timer)
  }, [query])

  const rows = useMemo(
    () => filterStockAlerts(alerts, { query: deferredQuery, filter }),
    [alerts, deferredQuery, filter],
  )

  const hasAlerts = (summary?.total || 0) > 0

  function onSaved() {
    setAdjusting(null)
    router.refresh()
  }

  return (
    <>
      <section className="admin-stock-stats" aria-label="Indicadores de estoque">
        {STATS.map((stat) => (
          <article key={stat.key} className={`admin-stock-stat admin-stock-stat--${stat.key}`}>
            <span className="admin-stock-stat__icon" aria-hidden="true">
              <AdminIcon name={stat.icon} />
            </span>
            <div>
              <span>{stat.label}</span>
              <strong>{summary?.[stat.key] || 0}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="admin-stock-board" aria-label="Monitoramento de estoque">
        <div className="admin-stock-board__head">
          <h2>Monitoramento de estoque</h2>
          <label className="admin-stock-search">
            <AdminIcon name="search" />
            <span className="visually-hidden">Buscar produto, tamanho ou cor</span>
            <input
              type="search"
              placeholder="Buscar produto, tamanho ou cor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="admin-stock-filters" role="group" aria-label="Filtros de estoque">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? 'is-active' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loadError ? (
          <div className="admin-stock-error">
            <p>{loadError}</p>
            <button type="button" className="admin-btn" onClick={() => router.refresh()}>
              Tentar novamente
            </button>
          </div>
        ) : !hasAlerts ? (
          <div className="admin-stock-empty">
            <span className="admin-stock-empty__mark" aria-hidden="true">
              <AdminIcon name="check" />
            </span>
            <h3>Estoque em dia</h3>
            <p>Nenhuma peça precisa de reposição no momento.</p>
            <p className="admin-muted">
              Os alertas aparecerão aqui automaticamente quando alguma variação atingir o estoque mínimo.
            </p>
            <Link href="/admin/produtos" className="admin-btn">
              Ver produtos
            </Link>
          </div>
        ) : !rows.length ? (
          <p className="admin-muted admin-stock-none">
            Nenhum alerta encontrado com essa busca ou filtro.
          </p>
        ) : (
          <>
            <div className="admin-table-wrap admin-stock-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Variação</th>
                    <th>Estoque</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.productName}</strong>
                      </td>
                      <td>{formatVariantLabel(item) || '—'}</td>
                      <td>{item.stock}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${item.status}`}>
                          {STOCK_STATUS_LABEL[item.status]}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          {item.productId ? (
                            <Link
                              href={`/admin/produtos/${item.productId}?variante=${item.id}`}
                              className="admin-link-btn"
                            >
                              Ver produto
                            </Link>
                          ) : null}
                          <button
                            type="button"
                            className="admin-link-btn"
                            onClick={() => setAdjusting(item)}
                          >
                            Ajustar estoque
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="admin-card-list admin-stock-cards" aria-label="Alertas de estoque">
              {rows.map((item) => (
                <li key={item.id} className="admin-card-item admin-card-item--text">
                  <div className="admin-card-item__body">
                    <strong>{item.productName}</strong>
                    <p>{formatVariantLabel(item) || 'Sem variação'}</p>
                    <p>Estoque {item.stock}</p>
                    <span className={`admin-badge admin-badge--${item.status}`}>
                      {STOCK_STATUS_LABEL[item.status]}
                    </span>
                    <div className="admin-row-actions">
                      {item.productId ? (
                        <Link
                          href={`/admin/produtos/${item.productId}?variante=${item.id}`}
                          className="admin-link-btn"
                        >
                          Ver produto
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        className="admin-link-btn"
                        onClick={() => setAdjusting(item)}
                      >
                        Ajustar estoque
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {adjusting ? (
        <AdjustStockDialog
          item={adjusting}
          onClose={() => setAdjusting(null)}
          onSaved={onSaved}
        />
      ) : null}
    </>
  )
}
