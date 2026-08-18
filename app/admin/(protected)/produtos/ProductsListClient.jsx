'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatBRL, formatDateTime } from '../../../../src/lib/admin/format'
import { toggleProductActive } from './actions'
import { classifyStock, STOCK_LEVELS, STOCK_STATUS } from '../../../../src/lib/admin/stock'

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Ativos' },
  { id: 'inactive', label: 'Inativos' },
  { id: 'featured', label: 'Destaques' },
  { id: 'low', label: 'Estoque baixo' },
]

function stockBadge(totalStock) {
  const status = classifyStock(totalStock)
  if (status === STOCK_STATUS.OUT) return { label: 'Esgotado', className: 'admin-badge--out' }
  if (status === STOCK_STATUS.CRITICAL || status === STOCK_STATUS.LOW) {
    return { label: 'Estoque baixo', className: 'admin-badge--low' }
  }
  return null
}

export default function ProductsListClient({ products: initialProducts }) {
  const router = useRouter()
  const [optimistic, setOptimistic] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const products = initialProducts
    .map((product) =>
      Object.prototype.hasOwnProperty.call(optimistic, product.id)
        ? { ...product, active: optimistic[product.id] }
        : product,
    )
    .filter((product) => {
      const haystack = `${product.name} ${product.slug} ${product.categoryName}`.toLowerCase()
      if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false
      if (filter === 'active') return product.active
      if (filter === 'inactive') return !product.active
      if (filter === 'featured') return product.featured
      if (filter === 'low') return product.totalStock <= STOCK_LEVELS.LOW_MAX
      return true
    })

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4000)
    return () => clearTimeout(timer)
  }, [message, error])

  async function onToggleActive(product) {
    setPendingId(product.id)
    setError('')
    setMessage('')
    const nextActive = !product.active
    setOptimistic((prev) => ({ ...prev, [product.id]: nextActive }))
    const result = await toggleProductActive(product.id, nextActive)
    setPendingId(null)

    if (!result.ok) {
      setOptimistic((prev) => {
        const copy = { ...prev }
        delete copy[product.id]
        return copy
      })
      setError(result.error)
      return
    }

    setMessage(result.message)
    router.refresh()
  }

  if (!initialProducts.length) {
    return (
      <div className="admin-empty">
        <p>Nenhum produto cadastrado ainda.</p>
        <Link href="/admin/produtos/novo" className="admin-btn">
          Cadastrar primeiro produto
        </Link>
      </div>
    )
  }

  return (
    <>
      {message ? <p className="admin-success" role="status">{message}</p> : null}
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      <div className="admin-toolbar">
        <label className="admin-search">
          <span className="visually-hidden">Buscar produtos</span>
          <input
            type="search"
            placeholder="Buscar por nome, slug ou categoria"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="admin-filters" role="group" aria-label="Filtros de produtos">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? 'is-active' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!products.length ? (
        <p className="admin-muted">Nenhum produto encontrado com esses filtros.</p>
      ) : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-thumb">
                    {product.coverUrl ? (
                      <img src={product.coverUrl} alt="" />
                    ) : (
                      <span>Sem foto</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="admin-cell-stack">
                    <strong>{product.name}</strong>
                    <span className="admin-muted">{product.slug}</span>
                  </div>
                </td>
                <td>{product.categoryName}</td>
                <td>{formatBRL(product.price)}</td>
                <td>{product.totalStock}</td>
                <td>
                  <div className="admin-status-stack">
                    <span
                      className={`admin-badge ${product.active ? 'admin-badge--ok' : 'admin-badge--off'}`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                    {product.featured ? (
                      <span className="admin-badge admin-badge--gold">Destaque</span>
                    ) : null}
                    {stockBadge(product.totalStock) ? (
                      <span className={`admin-badge ${stockBadge(product.totalStock).className}`}>
                        {stockBadge(product.totalStock).label}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link
                      href={`/admin/produtos/${product.id}?modo=ver`}
                      className="admin-link-btn"
                    >
                      Visualizar
                    </Link>
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="admin-link-btn"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="admin-link-btn"
                      disabled={pendingId === product.id}
                      onClick={() => onToggleActive(product)}
                    >
                      {pendingId === product.id
                        ? '…'
                        : product.active
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

      <ul className="admin-card-list" aria-label="Lista de produtos">
        {products.map((product) => (
          <li key={product.id} className="admin-card-item">
            <div className="admin-card-item__media">
              {product.coverUrl ? (
                <img src={product.coverUrl} alt="" />
              ) : (
                <span>Sem foto</span>
              )}
            </div>
            <div className="admin-card-item__body">
              <strong>{product.name}</strong>
              <p>
                {product.categoryName} · {product.collectionName}
              </p>
              <p>
                {formatBRL(product.price)} · Estoque {product.totalStock}
              </p>
              <div className="admin-status-stack">
                <span className={`admin-badge ${product.active ? 'admin-badge--ok' : 'admin-badge--off'}`}>
                  {product.active ? 'Ativo' : 'Inativo'}
                </span>
                {product.featured ? (
                  <span className="admin-badge admin-badge--gold">Destaque</span>
                ) : null}
                {stockBadge(product.totalStock) ? (
                  <span className={`admin-badge ${stockBadge(product.totalStock).className}`}>
                    {stockBadge(product.totalStock).label}
                  </span>
                ) : null}
              </div>
              <p className="admin-muted">{formatDateTime(product.updatedAt)}</p>
              <div className="admin-row-actions">
                <Link
                  href={`/admin/produtos/${product.id}?modo=ver`}
                  className="admin-link-btn"
                >
                  Visualizar
                </Link>
                <Link href={`/admin/produtos/${product.id}`} className="admin-link-btn">
                  Editar
                </Link>
                <button
                  type="button"
                  className="admin-link-btn"
                  disabled={pendingId === product.id}
                  onClick={() => onToggleActive(product)}
                >
                  {product.active ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
