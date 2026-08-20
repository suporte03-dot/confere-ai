'use client'

import { useEffect, useMemo, useState } from 'react'
import { buildPixPayload } from '../../../src/lib/pix/emv'
import { formatCurrency } from '../../../src/data/mockData'
import { orderStatusLabel, paymentStatusLabel } from '../../../src/lib/orders/status'
import QRCode from 'qrcode'

export default function OrderPaymentClient({ order, payment }) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const pixPayload = useMemo(() => {
    if (!payment?.pixKey) return null
    return buildPixPayload({
      key: payment.pixKey,
      merchantName: payment.pixReceiverName,
      merchantCity: payment.pixCity,
      amount: Number(order.total) || 0,
      txid: String(order.order_number || '')
        .replace(/[^A-Za-z0-9]/g, '')
        .slice(0, 25),
      description: `Pedido ${order.order_number}`,
    })
  }, [order, payment])

  useEffect(() => {
    let cancelled = false
    if (!pixPayload) {
      setQrDataUrl('')
      return undefined
    }
    QRCode.toDataURL(pixPayload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 240,
      color: { dark: '#1a1510', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('')
      })
    return () => {
      cancelled = true
    }
  }, [pixPayload])

  async function copyPix() {
    if (!pixPayload) return
    try {
      await navigator.clipboard.writeText(pixPayload)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const awaiting =
    order.payment_status === 'pending' && order.order_status === 'pending_payment'

  return (
    <div className="order-pay">
      <header className="order-pay__head">
        <p className="order-pay__eyebrow">Pedido criado</p>
        <h1>{order.order_number}</h1>
        <p>
          Status: <strong>{orderStatusLabel(order.order_status)}</strong>
          {' · '}
          Pagamento: <strong>{paymentStatusLabel(order.payment_status)}</strong>
        </p>
        <p className="order-pay__total">
          Total: <strong>{formatCurrency(Number(order.total) || 0)}</strong>
        </p>
      </header>

      <section className="order-pay__panel">
        <h2>Itens</h2>
        <ul className="order-pay__items">
          {(order.items || []).map((item, index) => (
            <li key={`${item.product_name}-${index}`}>
              <span>
                {item.quantity}× {item.product_name}
                {item.variant_label ? ` (${item.variant_label})` : ''}
              </span>
              <strong>{formatCurrency(Number(item.line_total) || 0)}</strong>
            </li>
          ))}
        </ul>
      </section>

      {awaiting ? (
        <section className="order-pay__panel">
          <h2>Pagamento</h2>
          <p className="order-pay__warn">
            O pagamento é confirmado manualmente pela loja. Não marque como pago apenas
            por ter gerado o Pix — aguarde nossa confirmação.
          </p>
          {payment?.pixInstructions ? <p>{payment.pixInstructions}</p> : null}

          {pixPayload ? (
            <div className="order-pay__pix">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="QR Code Pix" width={240} height={240} />
              ) : null}
              <label>
                Pix Copia e Cola
                <textarea readOnly rows={4} value={pixPayload} />
              </label>
              <button type="button" className="btn btn--primary" onClick={copyPix}>
                {copied ? 'Copiado!' : 'Copiar Pix'}
              </button>
              <p className="order-pay__meta">
                Recebedor: {payment.pixReceiverName || 'Terra e Estilo'}
                {payment.pixKey ? ` · Chave: ${payment.pixKey}` : ''}
              </p>
            </div>
          ) : (
            <p>Configure a chave Pix no painel administrativo para exibir o QR Code.</p>
          )}

          {payment?.paymentLinkUrl ? (
            <p>
              <a
                className="btn btn--ghost"
                href={payment.paymentLinkUrl}
                target="_blank"
                rel="noreferrer"
              >
                Abrir link de pagamento
              </a>
            </p>
          ) : null}
        </section>
      ) : (
        <section className="order-pay__panel">
          <p>
            {order.payment_status === 'paid'
              ? 'Pagamento confirmado. Em breve sua peça seguirá para preparação.'
              : 'Este pedido não está mais aguardando pagamento.'}
          </p>
        </section>
      )}
    </div>
  )
}
