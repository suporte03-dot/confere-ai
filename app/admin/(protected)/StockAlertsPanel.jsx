'use client'

import Link from 'next/link'
import { STOCK_STATUS_LABEL } from '../../../src/lib/admin/stock'

const SECTIONS = [
  { key: 'out', tone: 'out', title: 'Esgotado' },
  { key: 'critical', tone: 'critical', title: 'Estoque crítico' },
  { key: 'low', tone: 'low', title: 'Estoque baixo' },
]

function unitsLabel(stock) {
  const n = Number(stock) || 0
  return n === 1 ? '1 unidade' : `${n} unidades`
}

function variantLine(item) {
  return [item.color && `Cor: ${item.color}`, item.size && `Tamanho ${item.size}`]
    .filter(Boolean)
    .join(' · ')
}

export default function StockAlertsPanel({
  open,
  grouped,
  summary,
  onClose,
}) {
  const hasAlerts = (summary?.total || 0) > 0

  return (
    <>
      <button
        type="button"
        className={`admin-alerts-overlay${open ? ' is-open' : ''}`}
        aria-label="Fechar alertas"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={`admin-alerts-panel${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Alertas de estoque"
      >
        <div className="admin-alerts-panel__head">
          <div>
            <p className="admin-alerts-panel__kicker">Gestão</p>
            <h2>Alertas de estoque</h2>
          </div>
          <button
            type="button"
            className="admin-alerts-panel__close"
            aria-label="Fechar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {!hasAlerts ? (
          <p className="admin-alerts-empty">
            Nenhum alerta no momento. Variantes com mais de 5 unidades não aparecem aqui.
          </p>
        ) : (
          <div className="admin-alerts-groups">
            {SECTIONS.map((section) => {
              const items = grouped?.[section.key] || []
              if (!items.length) return null
              return (
                <section key={section.key} className={`admin-alerts-group admin-alerts-group--${section.tone}`}>
                  <h3>
                    <span aria-hidden="true" />
                    {section.title}
                    <em>{items.length}</em>
                  </h3>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <div className="admin-alerts-item__copy">
                          <strong>{item.productName}</strong>
                          <span>{variantLine(item) || STOCK_STATUS_LABEL[item.status]}</span>
                          <span>{unitsLabel(item.stock)}</span>
                        </div>
                        {item.productId ? (
                          <Link
                            href={`/admin/produtos/${item.productId}?variante=${item.id}`}
                            className="admin-link-btn"
                            onClick={onClose}
                          >
                            Ver produto
                          </Link>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </aside>
    </>
  )
}
