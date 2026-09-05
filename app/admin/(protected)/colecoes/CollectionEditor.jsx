'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { slugify } from '../../../../src/lib/admin/slugify'
import { checkCollectionSlug, saveCollection, deleteCollection } from './actions'
import { isAuditTestRecord } from '../../../../src/lib/admin/test-records'

export default function CollectionEditor({ mode = 'create', collection = null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [name, setName] = useState(collection?.name || '')
  const [slug, setSlug] = useState(collection?.slug || '')
  const [slugTouched, setSlugTouched] = useState(Boolean(collection?.slug))
  const [description, setDescription] = useState(collection?.description || '')
  const [active, setActive] = useState(collection?.active ?? true)
  const [featured, setFeatured] = useState(collection?.featured ?? false)
  const [sortOrder, setSortOrder] = useState(
    collection?.sortOrder != null ? String(collection.sortOrder) : '0',
  )
  const [collectionId, setCollectionId] = useState(collection?.id || null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [slugHint, setSlugHint] = useState('')

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4500)
    return () => clearTimeout(timer)
  }, [message, error])

  useEffect(() => {
    if (!slug) return undefined

    let cancelled = false
    const timer = setTimeout(async () => {
      const result = await checkCollectionSlug(slug, collectionId)
      if (cancelled) return
      if (!result.ok) {
        setSlugHint('Não foi possível validar o slug.')
        return
      }
      setSlugHint(
        result.available
          ? 'Slug disponível.'
          : 'Este slug já está em uso. Escolha outro.',
      )
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [slug, collectionId])

  function onNameChange(value) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  function onSlugChange(value) {
    setSlugTouched(true)
    setSlug(slugify(value))
  }

  function onSave(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (slugHint.includes('já está em uso')) {
      setError('Este slug já está em uso. Escolha outro.')
      return
    }

    startTransition(async () => {
      const result = await saveCollection({
        id: collectionId,
        name,
        slug,
        description,
        active,
        featured,
        sortOrder,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      setMessage(result.message || 'Coleção salva com sucesso.')
      setCollectionId(result.id)

      if (mode === 'create') {
        router.replace(`/admin/colecoes/${result.id}`)
        router.refresh()
        return
      }

      router.refresh()
    })
  }

  async function onDelete() {
    if (!collectionId) return
    if (
      !window.confirm(
        `Excluir a coleção de teste “${name}”? Esta ação não pode ser desfeita.`,
      )
    ) {
      return
    }
    startTransition(async () => {
      const result = await deleteCollection(collectionId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.replace('/admin/colecoes')
      router.refresh()
    })
  }

  return (
    <form className="admin-form admin-form--product" onSubmit={onSave}>
      <div className="admin-section">
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

        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="collection-name">Nome</label>
            <input
              id="collection-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="collection-slug">Slug</label>
            <input
              id="collection-slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              required
              autoComplete="off"
            />
            {slugHint ? (
              <span
                className={`admin-field-hint ${
                  slugHint.includes('disponível') ? 'is-ok' : 'is-error'
                }`}
              >
                {slugHint}
              </span>
            ) : null}
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="collection-description">Descrição (opcional)</label>
          <textarea
            id="collection-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="collection-sort">Ordem</label>
            <input
              id="collection-sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Flags</label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Coleção ativa
            </label>
            <span className="admin-field-hint">
              Somente coleções ativas aparecem no cadastro de produtos.
            </span>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Destaque
            </label>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar coleção'}
        </button>
        <Link href="/admin/colecoes" className="admin-btn admin-btn--ghost">
          Cancelar
        </Link>
        {collectionId && isAuditTestRecord({ name, slug }) ? (
          <button
            type="button"
            className="admin-btn admin-btn--danger-ghost"
            disabled={pending}
            onClick={onDelete}
          >
            Excluir teste
          </button>
        ) : null}
      </div>
    </form>
  )
}
