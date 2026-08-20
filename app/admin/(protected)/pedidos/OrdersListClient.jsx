'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatBRL, formatDateTime } from '../../../../src/lib/admin/format'
import {
  ORDER_STATUS,
  orderStatusLabel,
  paymentStatusLabel,
} from '../../../../src/lib/orders/status'
import { AdminIcon } from '../../components/AdminIcons'

const STATUS_FILTERS = [
  { id: 'all', label: 'Todos' },
  ...Object.entries(ORDER_STATUS).map(([id, label]) => ({ id, label })),
]

function statusBadgeClass(status) {
  if (status === 'paid' || status === 'delivered') return 'admin-badge--ok'
  if (status === 'cancelled' || status === 'expired') return 'admin-badge--off'
  if (status === 'pending_payment') return 'admin-badge--low'
  return 'admin-badge--gold'
}

export default function OrdersListClient({ orders: initialOrders, initialQ, initialStatus }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQ || '')
  const [status, setStatus] = useState(initialStatus || 'all')

  const orders = useMemo(() => {
    const term = query.trim().toLowerCase()
    return (initialOrders || []).filter((row) => {
      if (status !== 'all' && row.order_status !== status) return false
      if (!term) return true
      const hay = [
        row.order_number,
        row.customer_name,
        row.customer_email,
        row.customer_phone,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(term)
    })
  }, [initialOrders, query, status])

  function applyServerFilter(nextStatus, nextQ) {
    const params = new URLSearchParams()
    if (nextStatus && nextStatus !== 'all') params.set('status', nextStatus)
    if (nextQ?.trim()) params.set('q', nextQ.trim())
    const qs = params.toString()
    router.push(qs ? `/admin/pedidos?${qs}` : '/admin/pedidos')
  }

  if (!initialOrders.length) {
    return (
      <div className="admin-empty">
        <p>Nenhum pedido registrado ainda.</p>
      </div>
    )
  }

  return (
    <>
      <div className="admin-toolbar">
        <label className="admin-search">
          <AdminIcon name="search" />
          <span className="visually-hidden">Buscar pedidos</span>
          <input
            type="search"
            placeholder="Buscar por número, cliente, e-mail ou telefone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyServerFilter(status, query)
            }}
          />
        </label>
        <div className="admin-filters" role="group" aria-label="Filtros de status">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={status === item.id ? 'is-active' : ''}
              onClick={() => {
                setStatus(item.id)
                applyServerFilter(item.id, query)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!orders.length ? (
        <p className="admin-muted">Nenhum pedido encontrado com esses filtros.</p>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Total</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.order_number}</strong>
                    </td>
                    <td>
                      <div className="admin-cell-stack">
                        <strong>{order.customer_name}</strong>
                        <span className="admin-muted">{order.customer_email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${statusBadgeClass(order.order_status)}`}>
                        {orderStatusLabel(order.order_status)}
                      </span>
                    </td>
                    <td>{paymentStatusLabel(order.payment_status)}</td>
                    <td>{formatBRL(order.total)}</td>
                    <td>{formatDateTime(order.created_at)}</td>
                    <td>
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="admin-link-btn"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="admin-table-foot">
            <span>
              Mostrando {orders.length} de {initialOrders.length} pedidos
            </span>
          </footer>
        </div>
      )}

      <ul className="admin-card-list" aria-label="Lista de pedidos">
        {orders.map((order) => (
          <li key={order.id} className="admin-card-item admin-card-item--text">
            <div className="admin-card-item__body">
              <strong>{order.order_number}</strong>
              <p>{order.customer_name}</p>
              <p>{formatBRL(order.total)}</p>
              <div className="admin-status-stack">
                <span className={`admin-badge ${statusBadgeClass(order.order_status)}`}>
                  {orderStatusLabel(order.order_status)}
                </span>
              </div>
              <p className="admin-muted">{formatDateTime(order.created_at)}</p>
              <Link href={`/admin/pedidos/${order.id}`} className="admin-link-btn">
                Ver detalhes
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
