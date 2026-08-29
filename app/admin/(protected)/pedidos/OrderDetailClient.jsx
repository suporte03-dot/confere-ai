'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatBRL, formatDateTime } from '../../../../src/lib/admin/format'
import {
  canCancelOrder,
  canConfirmPayment,
  nextOrderStatuses,
  orderStatusLabel,
  paymentStatusLabel,
} from '../../../../src/lib/orders/status'
import {
  cancelOrderAction,
  confirmPaymentAction,
  resendOrderEmailAction,
  transitionStatusAction,
} from './actions'

const TIMELINE = [
  { status: 'pending_payment', label: 'Pedido criado' },
  { status: 'paid', label: 'Pagamento confirmado' },
  { status: 'processing', label: 'Em preparação' },
  { status: 'shipped', label: 'Enviado' },
  { status: 'delivered', label: 'Entregue' },
]

const EMAIL_EVENT_LABELS = {
  order_created: 'Pedido recebido',
  payment_confirmed: 'Pagamento confirmado',
  shipped: 'Envio',
  delivered: 'Entrega',
  cancelled: 'Cancelamento',
}

function formatAddress(order) {
  const parts = [
    [order.address_street, order.address_number].filter(Boolean).join(', '),
    order.address_complement,
    order.address_district,
    [order.address_city, order.address_state].filter(Boolean).join(' / '),
    order.address_cep ? `CEP ${order.address_cep}` : null,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : '—'
}

function eventFor(order, eventType) {
  return (order.emailEvents || []).find(
    (event) => event.event_type === eventType && event.recipient === order.customer_email,
  )
}

function EmailStatus({ event, onResend, pending }) {
  if (!event) {
    return <span className="admin-email-line__state is-pending">Ainda não aplicável</span>
  }
  if (event.status === 'sent') {
    return (
      <span className="admin-email-line__state is-sent">
        ✓ Enviado {event.sent_at ? formatDateTime(event.sent_at) : ''}
      </span>
    )
  }
  if (event.status === 'failed') {
    return (
      <span className="admin-email-line__actions">
        <span className="admin-email-line__state is-failed">Falhou</span>
        <button type="button" className="admin-link-btn" disabled={pending} onClick={onResend}>
          Reenviar e-mail
        </button>
      </span>
    )
  }
  return <span className="admin-email-line__state is-pending">Pendente</span>
}

export default function OrderDetailClient({ order }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4500)
    return () => clearTimeout(timer)
  }, [message, error])

  function runAction(fn, confirmText) {
    if (confirmText && !window.confirm(confirmText)) return
    setError('')
    setMessage('')
    startTransition(async () => {
      const result = await fn()
      if (!result.ok) {
        setError(result.error || 'Não foi possível concluir a operação.')
        return
      }
      setMessage(result.message || 'Atualizado com sucesso.')
      router.refresh()
    })
  }

  const nextStatuses = nextOrderStatuses(order.order_status)
  const showConfirm = canConfirmPayment(order)
  const showCancel = canCancelOrder(order)
  const historyByStatus = useMemo(
    () => new Map((order.history || []).map((entry) => [entry.to_order_status, entry])),
    [order.history],
  )

  return (
    <>
      {message ? <p className="admin-success" role="status">{message}</p> : null}
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      <section className="admin-order-hero">
        <div>
          <p className="admin-order-hero__eyebrow">Pedido</p>
          <h2>{order.order_number}</h2>
          <p className="admin-muted">Criado em {formatDateTime(order.created_at)}</p>
        </div>
        <div className="admin-status-stack">
          <span className="admin-badge admin-badge--gold">{orderStatusLabel(order.order_status)}</span>
          <span className="admin-badge admin-badge--low">{paymentStatusLabel(order.payment_status)}</span>
        </div>
      </section>

      <div className="admin-order-detail-grid">
        <section className="admin-section">
          <h2>Pedido</h2>
          <dl className="admin-dl">
            <div><dt>Número</dt><dd>{order.order_number}</dd></div>
            <div><dt>Status</dt><dd>{orderStatusLabel(order.order_status)}</dd></div>
            <div><dt>Total</dt><dd><strong>{formatBRL(order.total)}</strong></dd></div>
            {order.reserved_until ? <div><dt>Reserva até</dt><dd>{formatDateTime(order.reserved_until)}</dd></div> : null}
          </dl>
          <div className="admin-sticky-actions admin-order-detail-actions" style={{ position: 'static' }}>
            {showConfirm ? (
              <button type="button" className="admin-btn" disabled={pending} onClick={() => runAction(
                () => confirmPaymentAction(order.id),
                `Confirmar pagamento do pedido ${order.order_number}? Esta ação reserva o estoque como vendido.`,
              )}>
                Confirmar pagamento
              </button>
            ) : null}
            {nextStatuses.map((next) => (
              <button key={next} type="button" className="admin-btn admin-btn--ghost" disabled={pending} onClick={() => runAction(
                () => transitionStatusAction(order.id, next),
                `Avançar o pedido ${order.order_number} para ${orderStatusLabel(next)}?`,
              )}>
                Marcar como {orderStatusLabel(next)}
              </button>
            ))}
            {showCancel ? (
              <button type="button" className="admin-btn admin-btn--danger-ghost" disabled={pending} onClick={() => runAction(
                () => cancelOrderAction(order.id),
                `Cancelar o pedido ${order.order_number}?`,
              )}>
                Cancelar pedido
              </button>
            ) : null}
          </div>
        </section>

        <section className="admin-section">
          <h2>Cliente</h2>
          <dl className="admin-dl">
            <div><dt>Nome</dt><dd>{order.customer_name}</dd></div>
            <div><dt>E-mail</dt><dd>{order.customer_email}</dd></div>
            <div><dt>Telefone</dt><dd>{order.customer_phone}</dd></div>
            {order.customer_cpf ? <div><dt>CPF</dt><dd>{order.customer_cpf}</dd></div> : null}
          </dl>
        </section>

        <section className="admin-section">
          <h2>Entrega</h2>
          <p className="admin-order-address">{formatAddress(order)}</p>
          {order.notes ? <><h3 className="admin-subheading">Observações</h3><p>{order.notes}</p></> : null}
        </section>

        <section className="admin-section">
          <h2>Pagamento</h2>
          <dl className="admin-dl">
            <div><dt>Forma</dt><dd>Pix ou link externo</dd></div>
            <div><dt>Valor</dt><dd>{formatBRL(order.total)}</dd></div>
            <div><dt>Status</dt><dd>{paymentStatusLabel(order.payment_status)}</dd></div>
            <div><dt>Confirmado em</dt><dd>{order.paid_at ? formatDateTime(order.paid_at) : '—'}</dd></div>
          </dl>
        </section>
      </div>

      <section className="admin-section admin-order-items">
        <h2>Itens</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Produto</th><th>Variante</th><th>Qtd.</th><th>Preço unitário</th><th>Subtotal</th></tr></thead>
            <tbody>
              {(order.items || []).map((item) => (
                <tr key={item.id}>
                  <td><div className="admin-product-cell"><div className="admin-thumb" aria-hidden="true">TE</div><strong>{item.product_name}</strong></div></td>
                  <td>{item.variant_label || '—'}</td>
                  <td>{item.quantity}</td>
                  <td>{formatBRL(item.unit_price)}</td>
                  <td>{formatBRL(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="admin-order-lower-grid">
        <section className="admin-section">
          <h2>Andamento</h2>
          <ol className="admin-order-timeline">
            {TIMELINE.map((step) => {
              const entry = historyByStatus.get(step.status)
              const current = step.status === order.order_status
              const complete = Boolean(entry) && !current
              return (
                <li key={step.status} className={current ? 'is-current' : complete ? 'is-complete' : ''}>
                  <i aria-hidden="true" />
                  <span><strong>{step.label}</strong><small>{entry ? formatDateTime(entry.created_at) : 'Ainda não registrado'}</small></span>
                </li>
              )
            })}
            {order.order_status === 'cancelled' ? <li className="is-current is-cancelled"><i aria-hidden="true" /><span><strong>Cancelado</strong><small>{order.cancelled_at ? formatDateTime(order.cancelled_at) : 'Registrado'}</small></span></li> : null}
          </ol>
        </section>

        <section className="admin-section">
          <h2>E-mails</h2>
          <ul className="admin-email-lines">
            {Object.entries(EMAIL_EVENT_LABELS).map(([eventType, label]) => (
              <li key={eventType}>
                <span><strong>{label}</strong><small>Cliente · {order.customer_email}</small></span>
                <EmailStatus
                  event={eventFor(order, eventType)}
                  pending={pending}
                  onResend={() => runAction(
                    () => resendOrderEmailAction(order.id, eventType),
                    `Reenviar o e-mail “${label}” para ${order.customer_email}?`,
                  )}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
