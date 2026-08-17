'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  moveCollection,
  toggleCollectionActive,
  toggleCollectionFeatured,
} from './actions'

export default function CollectionsListClient({
  collections: initialCollections,
}) {
  const router = useRouter()
  const [optimisticActive, setOptimisticActive] = useState({})
  const [optimisticFeatured, setOptimisticFeatured] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  const collections = initialCollections.map((collection) => {
    const next = { ...collection }
    if (Object.prototype.hasOwnProperty.call(optimisticActive, collection.id)) {
      next.active = optimisticActive[collection.id]
    }
    if (
      Object.prototype.hasOwnProperty.call(optimisticFeatured, collection.id)
    ) {
      next.featured = optimisticFeatured[collection.id]
    }
    return next
  })

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4000)
    return () => clearTimeout(timer)
  }, [message, error])

  async function onToggleActive(collection) {
    setPendingId(collection.id)
    setError('')
    setMessage('')
    const nextActive = !collection.active
    setOptimisticActive((prev) => ({ ...prev, [collection.id]: nextActive }))
    const result = await toggleCollectionActive(collection.id, nextActive)
    setPendingId(null)

    if (!result.ok) {
      setOptimisticActive((prev) => {
        const copy = { ...prev }
        delete copy[collection.id]
        return copy
      })
      setError(result.error)
      return
    }

    setMessage(result.message)
    router.refresh()
  }

  async function onToggleFeatured(collection) {
    setPendingId(collection.id)
    setError('')
    setMessage('')
    const nextFeatured = !collection.featured
    setOptimisticFeatured((prev) => ({
      ...prev,
      [collection.id]: nextFeatured,
    }))
    const result = await toggleCollectionFeatured(collection.id, nextFeatured)
    setPendingId(null)

    if (!result.ok) {
      setOptimisticFeatured((prev) => {
        const copy = { ...prev }
        delete copy[collection.id]
        return copy
      })
      setError(result.error)
      return
    }

    setMessage(result.message)
    router.refresh()
  }

  async function onMove(collection, direction) {
    setPendingId(collection.id)
    setError('')
    setMessage('')
    const result = await moveCollection(collection.id, direction)
    setPendingId(null)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setMessage(result.message)
    router.refresh()
  }

  if (!collections.length) {
    return (
      <div className="admin-empty">
        <p>Nenhuma coleção cadastrada ainda.</p>
        <Link href="/admin/colecoes/novo" className="admin-btn">
          Cadastrar primeira coleção
        </Link>
      </div>
    )
  }

  return (
    <>
      {message ? <p className="admin-success" role="status">{message}</p> : null}
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table admin-table--compact">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Destaque</th>
              <th>Ordem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => (
              <tr key={collection.id}>
                <td>
                  <strong>{collection.name}</strong>
                </td>
                <td>
                  <span className="admin-muted">{collection.slug}</span>
                </td>
                <td>
                  <span
                    className={`admin-badge ${collection.active ? 'admin-badge--ok' : 'admin-badge--off'}`}
                  >
                    {collection.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>{collection.featured ? 'Sim' : 'Não'}</td>
                <td>
                  <div className="admin-order-controls">
                    <span>{collection.sortOrder}</span>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={pendingId === collection.id || index === 0}
                      onClick={() => onMove(collection, 'up')}
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={
                        pendingId === collection.id ||
                        index === collections.length - 1
                      }
                      onClick={() => onMove(collection, 'down')}
                      aria-label="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link
                      href={`/admin/colecoes/${collection.id}`}
                      className="admin-link-btn"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={pendingId === collection.id}
                      onClick={() => onToggleActive(collection)}
                    >
                      {pendingId === collection.id
                        ? '…'
                        : collection.active
                          ? 'Desativar'
                          : 'Ativar'}
                    </button>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={pendingId === collection.id}
                      onClick={() => onToggleFeatured(collection)}
                    >
                      {collection.featured ? 'Remover destaque' : 'Destacar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="admin-card-list" aria-label="Lista de coleções">
        {collections.map((collection, index) => (
          <li
            key={collection.id}
            className="admin-card-item admin-card-item--text"
          >
            <div className="admin-card-item__body">
              <strong>{collection.name}</strong>
              <p className="admin-muted">{collection.slug}</p>
              <p>
                Ordem {collection.sortOrder} ·{' '}
                {collection.active ? 'Ativa' : 'Inativa'} · Destaque{' '}
                {collection.featured ? 'Sim' : 'Não'}
              </p>
              <div className="admin-row-actions">
                <Link
                  href={`/admin/colecoes/${collection.id}`}
                  className="admin-link-btn"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={pendingId === collection.id}
                  onClick={() => onToggleActive(collection)}
                >
                  {collection.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={pendingId === collection.id}
                  onClick={() => onToggleFeatured(collection)}
                >
                  {collection.featured ? 'Remover destaque' : 'Destacar'}
                </button>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={pendingId === collection.id || index === 0}
                  onClick={() => onMove(collection, 'up')}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={
                    pendingId === collection.id ||
                    index === collections.length - 1
                  }
                  onClick={() => onMove(collection, 'down')}
                >
                  ↓
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
