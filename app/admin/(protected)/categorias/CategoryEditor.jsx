'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { slugify } from '../../../../src/lib/admin/slugify'
import { checkCategorySlug, saveCategory } from './actions'

export default function CategoryEditor({ mode = 'create', category = null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [slugTouched, setSlugTouched] = useState(Boolean(category?.slug))
  const [description, setDescription] = useState(category?.description || '')
  const [active, setActive] = useState(category?.active ?? true)
  const [sortOrder, setSortOrder] = useState(
    category?.sortOrder != null ? String(category.sortOrder) : '0',
  )
  const [categoryId, setCategoryId] = useState(category?.id || null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [slugHint, setSlugHint] = useState('')

  const title = useMemo(
    () => (mode === 'create' ? 'Nova categoria' : 'Editar categoria'),
    [mode],
  )

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
      const result = await checkCategorySlug(slug, categoryId)
      if (cancelled) return
      if (!result.ok) {
        setSlugHint('')
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
  }, [slug, categoryId])

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

    startTransition(async () => {
      const result = await saveCategory({
        id: categoryId,
        name,
        slug,
        description,
        active,
        sortOrder,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      setMessage(result.message || 'Categoria salva com sucesso.')
      setCategoryId(result.id)

      if (mode === 'create') {
        router.replace(`/admin/categorias/${result.id}`)
        router.refresh()
        return
      }

      router.refresh()
    })
  }

  return (
    <form className="admin-form admin-form--product" onSubmit={onSave}>
      <div className="admin-section">
        <h1>{title}</h1>
        <p>Defina nome, slug e ordem de exibição da categoria.</p>

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
            <label htmlFor="category-name">Nome</label>
            <input
              id="category-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="category-slug">Slug</label>
            <input
              id="category-slug"
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
          <label htmlFor="category-description">Descrição (opcional)</label>
          <textarea
            id="category-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-field">
            <label htmlFor="category-sort">Ordem</label>
            <input
              id="category-sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div className="admin-field">
            <label>Status</label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Categoria ativa
            </label>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button type="submit" className="admin-btn" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar categoria'}
        </button>
        <Link href="/admin/categorias" className="admin-btn admin-btn--ghost">
          Voltar à listagem
        </Link>
      </div>
    </form>
  )
}
