'use client'

import { useRef, useState } from 'react'

async function compressImage(file, { maxEdge = 1280, quality = 0.82 } = {}) {
  if (typeof createImageBitmap !== 'function') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })
  bitmap.close?.()
  if (!blob) return file
  return new File([blob], 'peca.jpg', { type: 'image/jpeg' })
}

export default function AiAssistPanel({
  enabled = false,
  disabled = false,
  onApply,
}) {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState(null)

  function resetAnalysis(keepFile = true) {
    setError('')
    setSuggestion(null)
    if (!keepFile) {
      setFile(null)
      setPreviewUrl('')
    }
  }

  function onPickFile(event) {
    const next = event.target.files?.[0] || null
    event.target.value = ''
    resetAnalysis(false)
    if (!next) return
    setFile(next)
    setPreviewUrl(URL.createObjectURL(next))
  }

  async function analyze() {
    if (!file || !enabled || disabled) return
    setBusy(true)
    setError('')
    setSuggestion(null)
    try {
      const compact = await compressImage(file)
      const formData = new FormData()
      formData.set('file', compact)
      const response = await fetch('/api/admin/ai/product-suggest', {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        setError(payload?.error || 'Não conseguimos analisar esta foto.')
        return
      }
      setSuggestion(payload.suggestion)
    } catch {
      setError('Não conseguimos analisar esta foto.')
    } finally {
      setBusy(false)
    }
  }

  const issues = suggestion?.photoQuality?.issues || []

  return (
    <section className="admin-section admin-ai">
      <div className="admin-section__head">
        <h2>Cadastro inteligente</h2>
      </div>
      <p className="admin-muted">
        A IA sugere nome, categoria, cor e descrição. Você revisa e só então salva o produto.
      </p>

      {!enabled ? (
        <p className="admin-field-hint">IA ainda não configurada neste ambiente.</p>
      ) : null}

      <div className="admin-ai__row">
        <button
          type="button"
          className="admin-ai__photo"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || busy}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Prévia da peça" />
          ) : (
            <span>Adicione uma foto da peça</span>
          )}
        </button>
        <div className="admin-ai__actions">
          <button
            type="button"
            className="admin-btn"
            onClick={analyze}
            disabled={!enabled || !file || disabled || busy}
          >
            {busy ? 'Analisando a peça…' : 'Preencher com IA'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || busy}
          >
            Escolher foto
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={onPickFile}
      />

      {error ? (
        <div className="admin-ai__error" role="alert">
          <p>Não conseguimos analisar esta foto.</p>
          <p className="admin-muted">{error}</p>
          <div className="admin-actions">
            <button type="button" className="admin-btn" onClick={analyze} disabled={busy || !file}>
              Tentar novamente
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => resetAnalysis(true)}
            >
              Continuar manualmente
            </button>
          </div>
        </div>
      ) : null}

      {suggestion ? (
        <div className="admin-ai__result">
          <h3>Sugestões da IA</h3>
          <dl>
            {suggestion.name ? (
              <>
                <dt>Nome</dt>
                <dd>{suggestion.name}</dd>
              </>
            ) : null}
            {suggestion.categoryName ? (
              <>
                <dt>Categoria</dt>
                <dd>{suggestion.categoryName}</dd>
              </>
            ) : null}
            {suggestion.primaryColor ? (
              <>
                <dt>Cor</dt>
                <dd>{suggestion.primaryColor}</dd>
              </>
            ) : null}
            {suggestion.productType ? (
              <>
                <dt>Tipo</dt>
                <dd>{suggestion.productType}</dd>
              </>
            ) : null}
            {suggestion.description ? (
              <>
                <dt>Descrição</dt>
                <dd>{suggestion.description}</dd>
              </>
            ) : null}
            {suggestion.slug ? (
              <>
                <dt>Slug</dt>
                <dd>{suggestion.slug}</dd>
              </>
            ) : null}
            {suggestion.detectedSize ? (
              <>
                <dt>Tamanho (etiqueta)</dt>
                <dd>{suggestion.detectedSize}</dd>
              </>
            ) : null}
          </dl>

          {suggestion.photoQuality?.suitableCover === false || issues.length ? (
            <div className="admin-ai__quality">
              <p>Recomendações da foto (não bloqueiam o cadastro)</p>
              <ul>
                {issues.length
                  ? issues.map((issue) => <li key={issue}>{issue}</li>)
                  : <li>A foto pode não ser a mais adequada para capa.</li>}
              </ul>
            </div>
          ) : (
            <p className="admin-field-hint is-ok">Foto adequada para capa.</p>
          )}

          <div className="admin-actions">
            <button
              type="button"
              className="admin-btn"
              onClick={() => onApply?.(suggestion)}
            >
              Aplicar sugestões
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setSuggestion(null)}
            >
              Revisar manualmente
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
