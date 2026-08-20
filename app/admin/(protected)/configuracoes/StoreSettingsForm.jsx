'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PIX_KEY_TYPES } from '../../../../src/lib/pix/emv'
import { saveStoreSettingsAction } from './actions'

export default function StoreSettingsForm({ settings }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    pix_key_type: settings?.pix_key_type || 'random',
    pix_key: settings?.pix_key || '',
    pix_receiver_name: settings?.pix_receiver_name || '',
    pix_city: settings?.pix_city || '',
    pix_instructions: settings?.pix_instructions || '',
    payment_link_url: settings?.payment_link_url || '',
    whatsapp: settings?.whatsapp || '',
    commercial_email: settings?.commercial_email || '',
    reservation_minutes: String(settings?.reservation_minutes ?? 60),
    low_stock_threshold: String(settings?.low_stock_threshold ?? 5),
  })

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4500)
    return () => clearTimeout(timer)
  }, [message, error])

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    startTransition(async () => {
      const result = await saveStoreSettingsAction(form)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setMessage(result.message || 'Configurações salvas.')
      router.refresh()
    })
  }

  return (
    <form className="admin-form admin-form--product" onSubmit={onSubmit}>
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

      <section className="admin-section">
        <h2>Pagamento Pix</h2>
        <p className="admin-muted">
          Esses dados alimentam o QR Code e o Pix copia e cola na página do pedido.
        </p>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="pix-key-type">Tipo de chave</label>
            <select
              id="pix-key-type"
              value={form.pix_key_type}
              onChange={(e) => setField('pix_key_type', e.target.value)}
              disabled={pending}
            >
              {PIX_KEY_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="pix-key">Chave Pix</label>
            <input
              id="pix-key"
              value={form.pix_key}
              onChange={(e) => setField('pix_key', e.target.value)}
              disabled={pending}
              autoComplete="off"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="pix-receiver">Nome do recebedor</label>
            <input
              id="pix-receiver"
              value={form.pix_receiver_name}
              onChange={(e) => setField('pix_receiver_name', e.target.value)}
              required
              disabled={pending}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="pix-city">Cidade</label>
            <input
              id="pix-city"
              value={form.pix_city}
              onChange={(e) => setField('pix_city', e.target.value)}
              required
              disabled={pending}
            />
            <span className="admin-field-hint">
              Use sem acentos, no máximo 15 caracteres (padrão Pix).
            </span>
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="pix-instructions">Instruções ao cliente</label>
            <textarea
              id="pix-instructions"
              rows={3}
              value={form.pix_instructions}
              onChange={(e) => setField('pix_instructions', e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="payment-link">Link de pagamento externo (opcional)</label>
            <input
              id="payment-link"
              type="url"
              placeholder="https://"
              value={form.payment_link_url}
              onChange={(e) => setField('payment_link_url', e.target.value)}
              disabled={pending}
            />
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Contato comercial</h2>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              id="whatsapp"
              value={form.whatsapp}
              onChange={(e) => setField('whatsapp', e.target.value)}
              placeholder="(00) 00000-0000"
              disabled={pending}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="commercial-email">E-mail comercial</label>
            <input
              id="commercial-email"
              type="email"
              value={form.commercial_email}
              onChange={(e) => setField('commercial_email', e.target.value)}
              disabled={pending}
            />
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Operação</h2>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="reservation-minutes">Reserva de estoque (minutos)</label>
            <input
              id="reservation-minutes"
              type="number"
              min={5}
              max={1440}
              value={form.reservation_minutes}
              onChange={(e) => setField('reservation_minutes', e.target.value)}
              required
              disabled={pending}
            />
            <span className="admin-field-hint">
              Tempo em que o estoque fica reservado aguardando pagamento.
            </span>
          </div>
          <div className="admin-field">
            <label htmlFor="low-stock">Limiar de estoque baixo</label>
            <input
              id="low-stock"
              type="number"
              min={0}
              max={9999}
              value={form.low_stock_threshold}
              onChange={(e) => setField('low_stock_threshold', e.target.value)}
              required
              disabled={pending}
            />
            <span className="admin-field-hint">
              Usado nos alertas do painel quando a quantidade disponível fica abaixo deste valor.
            </span>
          </div>
        </div>
      </section>

      <div className="admin-sticky-actions">
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar configurações'}
        </button>
      </div>
    </form>
  )
}
