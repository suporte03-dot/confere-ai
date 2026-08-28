'use client'

import { useRef, useState } from 'react'
import { createClient } from '../../../../src/lib/supabase/client'
import {
  AI_IMAGE_BUCKET,
  buildAiIntakePath,
  formatImageBytes,
  uploadImageToBucket,
  validateImageFile,
} from '../../../../src/lib/admin/product-image-upload'

export default function AiAssistPanel({
  enabled = false,
  disabled = false,
  onApply,
}) {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState(null)

  function resetAnalysis(keepFile = true) {
    setError('')
    setSuggestion(null)
    setStatus('')
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
    const fileError = validateImageFile(next)
    if (fileError) {
      setError(fileError)
      return
    }
    setFile(next)
    setPreviewUrl(URL.createObjectURL(next))
  }

  async function analyze() {
    if (!file || !enabled || disabled) return
    setBusy(true)
    setError('')
    setSuggestion(null)
    setStatus('Preparando imagem...')
    try {
      const fileError = validateImageFile(file)
      if (fileError) {
        setError(fileError)
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.id) {
        setError('Faça login para continuar.')
        return
      }

      setStatus('Enviando imagem...')
      const storagePath = buildAiIntakePath(user.id, file)
      await uploadImageToBucket(supabase, file, storagePath, AI_IMAGE_BUCKET)

      const response = await fetch('/api/admin/ai/product-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storagePath }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.ok) {
        setError(payload?.error || 'Não conseguimos analisar esta foto.')
        return
      }
      setStatus('Imagem enviada.')
      setSuggestion(payload.suggestion)
    } catch {
      setError('Não foi possível enviar a imagem.')
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
          {file ? (
            <p className="admin-photo__meta">
              <strong>{file.name}</strong>
              <span>{formatImageBytes(file.size)}</span>
              {status ? <em>{status}</em> : null}
            </p>
          ) : null}
          <button
            type="button"
            className="admin-btn"
            onClick={analyze}
            disabled={!enabled || !file || disabled || busy}
          >
            {busy ? status || 'Analisando a peça…' : 'Preencher com IA'}
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
        accept="image/jpeg,image/png,image/webp"
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
