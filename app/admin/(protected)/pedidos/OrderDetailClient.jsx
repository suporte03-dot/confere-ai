'use client'

import { useEffect, useState, useTransition } from 'react'
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
  transitionStatusAction,
} from './actions'

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

  return (
    <>
      {message ? (
        <p className="admin-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-detail-grid">
        <section className="admin-section">
          <h2>Resumo</h2>
          <dl className="admin-dl">
            <div>
              <dt>Status do pedido</dt>
              <dd>{orderStatusLabel(order.order_status)}</dd>
            </div>
            <div>
              <dt>Pagamento</dt>
              <dd>{paymentStatusLabel(order.payment_status)}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatBRL(order.subtotal)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>
                <strong>{formatBRL(order.total)}</strong>
              </dd>
            </div>
            <div>
              <dt>Criado em</dt>
              <dd>{formatDateTime(order.created_at)}</dd>
            </div>
            {order.reserved_until ? (
              <div>
                <dt>Reserva até</dt>
                <dd>{formatDateTime(order.reserved_until)}</dd>
              </div>
            ) : null}
            {order.paid_at ? (
              <div>
                <dt>Pago em</dt>
                <dd>{formatDateTime(order.paid_at)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="admin-sticky-actions" style={{ position: 'static', marginTop: '1.25rem' }}>
            {showConfirm ? (
              <button
                type="button"
                className="admin-btn"
                disabled={pending}
                onClick={() =>
                  runAction(
                    () => confirmPaymentAction(order.id),
                    `Confirmar pagamento do pedido ${order.order_number}? Esta ação reserva o estoque como vendido.`,
                  )
                }
              >
                Confirmar pagamento
              </button>
            ) : null}
            {nextStatuses.map((next) => (
              <button
                key={next}
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={pending}
                onClick={() =>
                  runAction(() => transitionStatusAction(order.id, next))
                }
              >
                Marcar como {orderStatusLabel(next)}
              </button>
            ))}
            {showCancel ? (
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={pending}
                onClick={() =>
                  runAction(
                    () => cancelOrderAction(order.id),
                    `Cancelar o pedido ${order.order_number}?`,
                  )
                }
              >
                Cancelar pedido
              </button>
            ) : null}
          </div>
        </section>

        <section className="admin-section">
          <h2>Cliente</h2>
          <dl className="admin-dl">
            <div>
              <dt>Nome</dt>
              <dd>{order.customer_name}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{order.customer_email}</dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>{order.customer_phone}</dd>
            </div>
            {order.customer_cpf ? (
              <div>
                <dt>CPF</dt>
                <dd>{order.customer_cpf}</dd>
              </div>
            ) : null}
          </dl>

          <h2 style={{ marginTop: '1.5rem' }}>Endereço</h2>
          <p>{formatAddress(order)}</p>
          {order.notes ? (
            <>
              <h2 style={{ marginTop: '1.5rem' }}>Observações</h2>
              <p>{order.notes}</p>
            </>
          ) : null}
        </section>
      </div>

      <section className="admin-section">
        <h2>Itens</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Variante</th>
                <th>Qtd</th>
                <th>Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.product_name}</strong>
                    {item.sku ? (
                      <span className="admin-muted"> · {item.sku}</span>
                    ) : null}
                  </td>
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

      <section className="admin-section">
        <h2>Histórico</h2>
        {(order.history || []).length ? (
          <ul className="admin-attention__list">
            {(order.history || []).map((entry) => (
              <li key={entry.id}>
                <div>
                  <strong>
                    {orderStatusLabel(entry.to_order_status)}
                    {entry.to_payment_status
                      ? ` · ${paymentStatusLabel(entry.to_payment_status)}`
                      : ''}
                  </strong>
                  <span>
                    {entry.from_order_status
                      ? `De ${orderStatusLabel(entry.from_order_status)}`
                      : 'Registro inicial'}
                    {entry.note ? ` — ${entry.note}` : ''}
                  </span>
                </div>
                <span className="admin-muted">{formatDateTime(entry.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-muted">Sem histórico registrado.</p>
        )}
      </section>
    </>
  )
}
