'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { updateVariantStock } from './actions'
import { AdminIcon } from '../../components/AdminIcons'

export default function AdjustStockDialog({ item, onClose, onSaved }) {
  const titleId = useId()
  const inputRef = useRef(null)
  const [stock, setStock] = useState(String(item?.stock ?? 0))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('admin-dialog-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('admin-dialog-open')
    }
  }, [onClose])

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    const trimmed = String(stock).trim()
    const parsed = Number.parseInt(trimmed, 10)
    if (!trimmed || !Number.isInteger(parsed) || parsed < 0) {
      setError('Informe uma quantidade válida (número inteiro ≥ 0).')
      return
    }
    setPending(true)
    try {
      const result = await updateVariantStock(item.id, parsed)
      if (!result.ok) {
        setError(result.error)
        return
      }
      onSaved()
    } catch {
      setError('Não foi possível atualizar o estoque. Tente novamente.')
    } finally {
      setPending(false)
    }
  }

  const variant = [item.color, item.size].filter(Boolean).join(' • ')

  return (
    <div className="admin-dialog">
      <button
        type="button"
        className="admin-dialog__overlay"
        aria-label="Fechar ajuste de estoque"
        onClick={onClose}
      />
      <form
        className="admin-dialog__panel"
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="admin-dialog__head">
          <h2 id={titleId}>Ajustar estoque</h2>
          <button
            type="button"
            className="admin-dialog__close"
            aria-label="Fechar"
            onClick={onClose}
          >
            <AdminIcon name="close" />
          </button>
        </div>
        <p className="admin-dialog__lead">
          <strong>{item.productName}</strong>
          {variant ? <span>{variant}</span> : null}
        </p>
        <div className="admin-field">
          <label htmlFor="adjust-stock">Quantidade</label>
          <input
            ref={inputRef}
            id="adjust-stock"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            disabled={pending}
            required
          />
        </div>
        {error ? <p className="admin-error" role="alert">{error}</p> : null}
        <div className="admin-dialog__actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="admin-btn" disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar estoque'}
          </button>
        </div>
      </form>
    </div>
  )
}
