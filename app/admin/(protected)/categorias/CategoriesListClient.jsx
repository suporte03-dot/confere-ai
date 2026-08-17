'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { moveCategory, toggleCategoryActive } from './actions'

export default function CategoriesListClient({ categories: initialCategories }) {
  const router = useRouter()
  const [optimistic, setOptimistic] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  const categories = initialCategories.map((category) =>
    Object.prototype.hasOwnProperty.call(optimistic, category.id)
      ? { ...category, active: optimistic[category.id] }
      : category,
  )

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4000)
    return () => clearTimeout(timer)
  }, [message, error])

  async function onToggleActive(category) {
    setPendingId(category.id)
    setError('')
    setMessage('')
    const nextActive = !category.active
    setOptimistic((prev) => ({ ...prev, [category.id]: nextActive }))
    const result = await toggleCategoryActive(category.id, nextActive)
    setPendingId(null)

    if (!result.ok) {
      setOptimistic((prev) => {
        const copy = { ...prev }
        delete copy[category.id]
        return copy
      })
      setError(result.error)
      return
    }

    setMessage(result.message)
    router.refresh()
  }

  async function onMove(category, direction) {
    setPendingId(category.id)
    setError('')
    setMessage('')
    const result = await moveCategory(category.id, direction)
    setPendingId(null)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setMessage(result.message)
    router.refresh()
  }

  if (!categories.length) {
    return (
      <div className="admin-empty">
        <p>Nenhuma categoria cadastrada ainda.</p>
        <Link href="/admin/categorias/novo" className="admin-btn">
          Cadastrar primeira categoria
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
              <th>Ordem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>
                  <strong>{category.name}</strong>
                </td>
                <td>
                  <span className="admin-muted">{category.slug}</span>
                </td>
                <td>
                  <span
                    className={`admin-badge ${category.active ? 'admin-badge--ok' : 'admin-badge--off'}`}
                  >
                    {category.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <div className="admin-order-controls">
                    <span>{category.sortOrder}</span>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={pendingId === category.id || index === 0}
                      onClick={() => onMove(category, 'up')}
                      aria-label="Mover para cima"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={
                        pendingId === category.id ||
                        index === categories.length - 1
                      }
                      onClick={() => onMove(category, 'down')}
                      aria-label="Mover para baixo"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link
                      href={`/admin/categorias/${category.id}`}
                      className="admin-link-btn"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={pendingId === category.id}
                      onClick={() => onToggleActive(category)}
                    >
                      {pendingId === category.id
                        ? '…'
                        : category.active
                          ? 'Desativar'
                          : 'Ativar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="admin-card-list" aria-label="Lista de categorias">
        {categories.map((category, index) => (
          <li key={category.id} className="admin-card-item admin-card-item--text">
            <div className="admin-card-item__body">
              <strong>{category.name}</strong>
              <p className="admin-muted">{category.slug}</p>
              <p>
                Ordem {category.sortOrder} ·{' '}
                {category.active ? 'Ativa' : 'Inativa'}
              </p>
              <div className="admin-row-actions">
                <Link
                  href={`/admin/categorias/${category.id}`}
                  className="admin-link-btn"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={pendingId === category.id}
                  onClick={() => onToggleActive(category)}
                >
                  {category.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={pendingId === category.id || index === 0}
                  onClick={() => onMove(category, 'up')}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={
                    pendingId === category.id || index === categories.length - 1
                  }
                  onClick={() => onMove(category, 'down')}
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
