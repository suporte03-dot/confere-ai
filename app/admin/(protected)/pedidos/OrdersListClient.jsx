'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatBRL, formatDateTime } from '../../../../src/lib/admin/format'
import {
  ORDER_STATUS,
  canCancelOrder,
  canConfirmPayment,
  nextOrderStatuses,
  orderStatusLabel,
  paymentStatusLabel,
} from '../../../../src/lib/orders/status'
import {
  cancelOrderAction,
  confirmPaymentAction,
  transitionStatusAction,
} from './actions'
import { AdminIcon } from '../../components/AdminIcons'

const STATUS_FILTERS = [
  { id: 'all', label: 'Todos' },
  ...Object.entries(ORDER_STATUS).map(([id, label]) => ({ id, label })),
]

const PAYMENT_FILTERS = [
  { id: 'all', label: 'Todos' },
  ...Object.entries({
    pending: 'Pendente',
    paid: 'Pago',
    expired: 'Expirado',
    cancelled: 'Cancelado',
  }).map(([id, label]) => ({ id, label })),
]

const PERIOD_FILTERS = [
  { id: 'all', label: 'Todo o período' },
  { id: 'today', label: 'Hoje' },
  { id: '7d', label: 'Últimos 7 dias' },
  { id: '30d', label: 'Últimos 30 dias' },
  { id: 'month', label: 'Este mês' },
  { id: 'custom', label: 'Personalizado' },
]

const SORT_OPTIONS = [
  { id: 'newest', label: 'Mais recentes' },
  { id: 'oldest', label: 'Mais antigos' },
  { id: 'highest', label: 'Maior valor' },
  { id: 'lowest', label: 'Menor valor' },
]

function statusBadgeClass(status) {
  if (status === 'paid' || status === 'delivered') return 'admin-badge--ok'
  if (status === 'cancelled') return 'admin-badge--out'
  if (status === 'expired') return 'admin-badge--off'
  if (status === 'pending_payment') return 'admin-badge--low'
  return 'admin-badge--gold'
}

function paymentBadgeClass(status) {
  if (status === 'paid') return 'admin-badge--ok'
  if (status === 'cancelled' || status === 'refunded') return 'admin-badge--out'
  if (status === 'expired') return 'admin-badge--off'
  return 'admin-badge--low'
}

function emailStatus(order) {
  const event = (order.email_events || []).find((item) => item.event_type === 'order_created')
  if (!event) return { label: 'Pendente', className: 'admin-email-badge--pending' }
  if (event.status === 'sent') return { label: 'Enviado', className: 'admin-email-badge--sent' }
  if (event.status === 'failed') return { label: 'Falhou', className: 'admin-email-badge--failed' }
  return { label: 'Pendente', className: 'admin-email-badge--pending' }
}

function needsAttention(order) {
  if (order.order_status === 'pending_payment') return true
  if (order.order_status === 'paid') return true
  if ((order.email_events || []).some((event) => event.status === 'failed')) return true
  if (order.order_status === 'processing') {
    return Date.now() - new Date(order.updated_at || order.created_at).getTime() > 48 * 60 * 60 * 1000
  }
  return false
}

function getCardLabel(stats, id) {
  return {
    pending_payment: ['Aguardando pagamento', stats?.pendingPayment || 0],
    paid: ['Pagos', stats?.paid || 0],
    processing: ['Em preparação', stats?.processing || 0],
    shipped: ['Enviados', stats?.shipped || 0],
  }[id]
}

function QuickOrderActions({ order }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const nextStatuses = nextOrderStatuses(order.order_status)
  const actions = []

  if (canConfirmPayment(order)) {
    actions.push({
      label: 'Confirmar pagamento',
      run: () => confirmPaymentAction(order.id),
      confirm: `Confirmar pagamento do pedido ${order.order_number}?`,
    })
  }
  for (const next of nextStatuses) {
    actions.push({
      label: `Marcar como ${orderStatusLabel(next)}`,
      run: () => transitionStatusAction(order.id, next),
      confirm: `Avançar o pedido ${order.order_number} para ${orderStatusLabel(next)}?`,
    })
  }
  if (canCancelOrder(order)) {
    actions.push({
      label: 'Cancelar pedido',
      run: () => cancelOrderAction(order.id),
      confirm: `Cancelar o pedido ${order.order_number}?`,
    })
  }

  function run(action) {
    if (!window.confirm(action.confirm)) return
    startTransition(async () => {
      await action.run()
      router.refresh()
    })
  }

  return (
    <div className="admin-row-actions">
      {actions.slice(0, 2).map((action) => (
        <button
          key={action.label}
          type="button"
          className="admin-link-btn admin-link-btn--action"
          disabled={pending}
          onClick={() => run(action)}
        >
          {pending ? 'Aguarde…' : action.label}
        </button>
      ))}
    </div>
  )
}

export default function OrdersListClient({
  orders: initialOrders = [],
  stats,
  initialQ,
  initialStatus,
  initialPayment,
  initialPeriod,
  initialDateFrom,
  initialDateTo,
  initialSort,
}) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQ || '')
  const [status, setStatus] = useState(initialStatus || 'all')
  const [payment, setPayment] = useState(initialPayment || 'all')
  const [period, setPeriod] = useState(initialPeriod || 'all')
  const [dateFrom, setDateFrom] = useState(initialDateFrom || '')
  const [dateTo, setDateTo] = useState(initialDateTo || '')
  const [sort, setSort] = useState(initialSort || 'newest')

  const orders = useMemo(() => initialOrders, [initialOrders])

  const applyServerFilter = useCallback((overrides = {}) => {
    const next = {
      status,
      payment,
      period,
      dateFrom,
      dateTo,
      sort,
      ...overrides,
    }
    const params = new URLSearchParams()
    if (next.status && next.status !== 'all') params.set('status', next.status)
    if (next.payment && next.payment !== 'all') params.set('payment', next.payment)
    if (next.period && next.period !== 'all') params.set('period', next.period)
    if (next.dateFrom) params.set('from', next.dateFrom)
    if (next.dateTo) params.set('to', next.dateTo)
    if (next.sort && next.sort !== 'newest') params.set('sort', next.sort)
    if (next.query?.trim()) params.set('q', next.query.trim())
    const qs = params.toString()
    router.push(qs ? `/admin/pedidos?${qs}` : '/admin/pedidos')
  }, [dateFrom, dateTo, payment, period, router, sort, status])

  useEffect(() => {
    if (query.trim() === String(initialQ || '').trim()) return undefined
    const timer = setTimeout(() => applyServerFilter({ query }), 350)
    return () => clearTimeout(timer)
  }, [applyServerFilter, initialQ, query])

  function changeFilter(key, value) {
    const setters = {
      status: setStatus,
      payment: setPayment,
      period: setPeriod,
      sort: setSort,
    }
    setters[key]?.(value)
    applyServerFilter({ [key]: value, query })
  }

  const cards = ['pending_payment', 'paid', 'processing', 'shipped']
  const hasActiveFilters = Boolean(
    query.trim() ||
      status !== 'all' ||
      payment !== 'all' ||
      period !== 'all' ||
      dateFrom ||
      dateTo ||
      sort !== 'newest',
  )

  return (
    <>
      <section className="admin-order-kpis" aria-label="Resumo dos pedidos">
        {cards.map((id) => {
          const [label, count] = getCardLabel(stats, id)
          return (
            <button
              key={id}
              type="button"
              className={`admin-order-kpi ${status === id ? 'is-active' : ''}`}
              onClick={() => changeFilter('status', id)}
            >
              <span>{label}</span>
              <strong>{count}</strong>
              <small>Ver pedidos</small>
            </button>
          )
        })}
      </section>

      <div className="admin-toolbar admin-orders-toolbar">
        <label className="admin-search">
          <AdminIcon name="search" />
          <span className="visually-hidden">Buscar pedidos</span>
          <input
            type="search"
            placeholder="Buscar por número, cliente, e-mail ou telefone"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="admin-order-filter-row">
          <label>
            <span>Período</span>
            <select value={period} onChange={(e) => changeFilter('period', e.target.value)}>
              {PERIOD_FILTERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          {period === 'custom' ? (
            <>
              <label>
                <span>De</span>
                <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); applyServerFilter({ dateFrom: e.target.value, query }) }} />
              </label>
              <label>
                <span>Até</span>
                <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); applyServerFilter({ dateTo: e.target.value, query }) }} />
              </label>
            </>
          ) : null}
          <label>
            <span>Pagamento</span>
            <select value={payment} onChange={(e) => changeFilter('payment', e.target.value)}>
              {PAYMENT_FILTERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label>
            <span>Ordenar</span>
            <select value={sort} onChange={(e) => changeFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        </div>
        <div className="admin-filters" role="group" aria-label="Filtros de status">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={status === item.id ? 'is-active' : ''}
              onClick={() => changeFilter('status', item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!orders.length ? (
        <div className="admin-empty admin-orders-empty">
          <p>{hasActiveFilters ? 'Nenhum pedido encontrado com esses filtros.' : 'Nenhum pedido registrado ainda.'}</p>
        </div>
      ) : (
        <div className="admin-table-card admin-orders-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table admin-orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Pagamento</th>
                  <th>Andamento</th>
                  <th>Total</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const mail = emailStatus(order)
                  return (
                    <tr key={order.id} className={needsAttention(order) ? 'is-attention' : ''}>
                      <td>
                        <div className="admin-order-number">
                          {needsAttention(order) ? <i title="Pedido precisa de atenção" aria-label="Precisa de atenção" /> : null}
                          <strong>{order.order_number}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="admin-cell-stack">
                          <strong>{order.customer_name}</strong>
                          <span className="admin-muted">{order.customer_email}</span>
                          {order.customer_phone ? <span className="admin-muted">{order.customer_phone}</span> : null}
                        </div>
                      </td>
                      <td>{formatDateTime(order.created_at)}</td>
                      <td><span className={`admin-badge ${paymentBadgeClass(order.payment_status)}`}>{paymentStatusLabel(order.payment_status)}</span></td>
                      <td><span className={`admin-badge ${statusBadgeClass(order.order_status)}`}>{orderStatusLabel(order.order_status)}</span></td>
                      <td><strong>{formatBRL(order.total)}</strong></td>
                      <td><span className={`admin-email-badge ${mail.className}`}>{mail.label}</span></td>
                      <td>
                        <div className="admin-table-actions">
                          <Link href={`/admin/pedidos/${order.id}`} className="admin-link-btn">Ver detalhes</Link>
                          <QuickOrderActions order={order} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <footer className="admin-table-foot">
            <span>Mostrando {orders.length} pedidos</span>
          </footer>
        </div>
      )}

      <ul className="admin-card-list admin-orders-card-list" aria-label="Lista de pedidos">
        {orders.map((order) => {
          const mail = emailStatus(order)
          return (
            <li key={order.id} className={`admin-card-item admin-card-item--text ${needsAttention(order) ? 'is-attention' : ''}`}>
              <div className="admin-card-item__body">
                <div className="admin-order-card-head">
                  <strong>{order.order_number}</strong>
                  <span className={`admin-email-badge ${mail.className}`}>{mail.label}</span>
                </div>
                <p>{order.customer_name}</p>
                <p>{formatBRL(order.total)}</p>
                <div className="admin-status-stack">
                  <span className={`admin-badge ${paymentBadgeClass(order.payment_status)}`}>{paymentStatusLabel(order.payment_status)}</span>
                  <span className={`admin-badge ${statusBadgeClass(order.order_status)}`}>{orderStatusLabel(order.order_status)}</span>
                </div>
                <p className="admin-muted">{formatDateTime(order.created_at)}</p>
                <Link href={`/admin/pedidos/${order.id}`} className="admin-link-btn">Ver detalhes</Link>
                <QuickOrderActions order={order} />
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
