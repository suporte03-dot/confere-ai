'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatBRL, formatDateTime } from '../../../../src/lib/admin/format'
import { toggleProductActive } from './actions'

export default function ProductsListClient({ products: initialProducts }) {
  const router = useRouter()
  const [optimistic, setOptimistic] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  const products = initialProducts.map((product) =>
    Object.prototype.hasOwnProperty.call(optimistic, product.id)
      ? { ...product, active: optimistic[product.id] }
      : product,
  )

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

  if (!products.length) {
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

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Capa</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Coleção</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Destaque</th>
              <th>Estoque</th>
              <th>Atualizado</th>
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
                <td>{product.collectionName}</td>
                <td>{formatBRL(product.price)}</td>
                <td>
                  <span
                    className={`admin-badge ${product.active ? 'admin-badge--ok' : 'admin-badge--off'}`}
                  >
                    {product.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>{product.featured ? 'Sim' : 'Não'}</td>
                <td>{product.totalStock}</td>
                <td>{formatDateTime(product.updatedAt)}</td>
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
