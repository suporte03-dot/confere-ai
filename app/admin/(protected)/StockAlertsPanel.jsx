'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { formatDateTime } from '../../../src/lib/admin/format'
import { AdminIcon } from '../components/AdminIcons'

const SECTIONS = [
  { kind: 'order', title: 'Pedidos', className: 'admin-alerts-group--low', icon: 'orders' },
  { kind: 'stock', title: 'Estoque', className: 'admin-alerts-group--critical', icon: 'stock' },
  { kind: 'email', title: 'E-mails', className: 'admin-alerts-group--out', icon: 'bell' },
]

export default function StockAlertsPanel({ open, notifications = [], onClose }) {
  const closeRef = useRef(null)
  const hasAlerts = notifications.length > 0

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
        aria-label="Alertas administrativos"
      >
        <div className="admin-alerts-panel__head">
          <div>
            <p className="admin-alerts-panel__kicker">Gestão</p>
            <h2>Central de alertas</h2>
            <span className="admin-alerts-panel__count">
              {hasAlerts ? `${notifications.length} pendente${notifications.length === 1 ? '' : 's'}` : 'Tudo em dia'}
            </span>
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
            Nenhum pedido ou operação precisa de atenção no momento.
          </p>
        ) : (
          <div className="admin-alerts-groups">
            {SECTIONS.map((section) => {
              const items = notifications.filter((item) => item.kind === section.kind)
              if (!items.length) return null
              return (
                <section key={section.kind} className={`admin-alerts-group ${section.className}`}>
                  <h3>
                    <span aria-hidden="true"><AdminIcon name={section.icon} /></span>
                    {section.title}
                    <em>{items.length}</em>
                  </h3>
                  <ul>
                    {items.map((item) => (
                      <li key={item.id}>
                        <div className={`admin-alerts-item__icon admin-alerts-item__icon--${item.tone || 'gold'}`} aria-hidden="true">
                          <AdminIcon name={section.icon} />
                        </div>
                        <div className="admin-alerts-item__copy">
                          <strong>{item.title}</strong>
                          <span>{item.detail}</span>
                          {item.date ? <time dateTime={item.date}>{formatDateTime(item.date)}</time> : null}
                        </div>
                        <Link href={item.href} className="admin-link-btn" onClick={onClose}>
                          Ver
                        </Link>
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
