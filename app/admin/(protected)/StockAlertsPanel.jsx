'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { STOCK_STATUS_LABEL, formatVariantLabel } from '../../../src/lib/admin/stock'
import { AdminIcon } from '../components/AdminIcons'

const SECTIONS = [
  { key: 'out', tone: 'out', title: 'Esgotados' },
  { key: 'critical', tone: 'critical', title: 'Críticos' },
  { key: 'low', tone: 'low', title: 'Estoque baixo' },
]

function unitsLabel(stock) {
  const n = Number(stock) || 0
  return n === 1 ? '1 unidade' : `${n} unidades`
}

export default function StockAlertsPanel({
  open,
  grouped,
  summary,
  onClose,
}) {
  const closeRef = useRef(null)
  const hasAlerts = (summary?.total || 0) > 0

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

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
            ref={closeRef}
            type="button"
            className="admin-alerts-panel__close"
            aria-label="Fechar"
            onClick={onClose}
          >
            <AdminIcon name="close" />
          </button>
        </div>

        {!hasAlerts ? (
          <p className="admin-alerts-empty">
            Nenhuma peça precisa de reposição no momento. Os alertas aparecem automaticamente
            quando alguma variação atinge o estoque mínimo.
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
                          <span>{formatVariantLabel(item) || STOCK_STATUS_LABEL[item.status]}</span>
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
