'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { moveCategory, toggleCategoryActive, deleteCategory } from './actions'
import { AdminIcon, AdminIconAction } from '../../components/AdminIcons'
import { isAuditTestRecord } from '../../../../src/lib/admin/test-records'
import { buildCategoryTree } from '../../../../src/lib/admin/category-tree'

function siblingBounds(siblings, id) {
  const index = siblings.findIndex((item) => item.id === id)
  return {
    index,
    isFirst: index <= 0,
    isLast: index < 0 || index >= siblings.length - 1,
  }
}

function StatusBadge({ active }) {
  return (
    <span className={`admin-badge ${active ? 'admin-badge--ok' : 'admin-badge--off'}`}>
      {active ? 'Ativa' : 'Inativa'}
    </span>
  )
}

function OrderControls({ pending, bounds, onUp, onDown, sortOrder }) {
  return (
    <div className="admin-order-controls">
      <button
        type="button"
        disabled={pending || bounds.isFirst}
        onClick={onUp}
        aria-label="Mover para cima"
      >
        <AdminIcon name="up" />
      </button>
      <span>{sortOrder}</span>
      <button
        type="button"
        disabled={pending || bounds.isLast}
        onClick={onDown}
        aria-label="Mover para baixo"
      >
        <AdminIcon name="down" />
      </button>
    </div>
  )
}

export default function CategoriesListClient({ categories: initialCategories }) {
  const router = useRouter()
  const [optimistic, setOptimistic] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [expanded, setExpanded] = useState(() => {
    const initial = {}
    for (const item of initialCategories || []) {
      if (!item.parentId) initial[item.id] = true
    }
    return initial
  })

  const categories = initialCategories.map((category) =>
    Object.prototype.hasOwnProperty.call(optimistic, category.id)
      ? { ...category, active: optimistic[category.id] }
      : category,
  )

  const tree = useMemo(() => buildCategoryTree(categories), [categories])
  const activeCount = categories.filter((item) => item.active).length
  const rootCount = tree.length
  const childCount = categories.filter((item) => item.parentId).length

  useEffect(() => {
    if (!message && !error) return undefined
    const timer = setTimeout(() => {
      setMessage('')
      setError('')
    }, 4000)
    return () => clearTimeout(timer)
  }, [message, error])

  function toggleExpanded(rootId) {
    setExpanded((prev) => ({ ...prev, [rootId]: !prev[rootId] }))
  }

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

  async function onDelete(category) {
    if (
      !window.confirm(
        `Excluir a categoria de teste “${category.name}”? Esta ação não pode ser desfeita.`,
      )
    ) {
      return
    }
    setPendingId(category.id)
    setError('')
    setMessage('')
    const result = await deleteCategory(category.id)
    setPendingId(null)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setMessage(result.message)
    router.refresh()
  }

  function CategoryActions({ category, showAddSubcategory = false }) {
    return (
      <div className="admin-row-actions">
        <AdminIconAction
          href={`/admin/categorias/${category.id}`}
          icon="pencil"
          label="Editar"
        />
        {showAddSubcategory ? (
          <AdminIconAction
            href={`/admin/categorias/novo?parentId=${encodeURIComponent(category.id)}`}
            icon="plus"
            label="Adicionar subcategoria"
          />
        ) : null}
        <AdminIconAction
          icon="power"
          label={
            pendingId === category.id
              ? '…'
              : category.active
                ? 'Desativar'
                : 'Ativar'
          }
          danger={category.active}
          disabled={pendingId === category.id}
          onClick={() => onToggleActive(category)}
        />
        {isAuditTestRecord(category) ? (
          <AdminIconAction
            icon="trash"
            label="Excluir teste"
            danger
            disabled={pendingId === category.id}
            onClick={() => onDelete(category)}
          />
        ) : null}
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className="admin-empty">
        <p>Nenhuma categoria cadastrada ainda.</p>
        <Link href="/admin/categorias/novo" className="admin-btn">
          <AdminIcon name="plus" />
          Cadastrar primeira categoria
        </Link>
      </div>
    )
  }

  return (
    <>
      {message ? <p className="admin-success" role="status">{message}</p> : null}
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      <section className="admin-mini-stats" aria-label="Resumo de categorias">
        <article>
          <span className="admin-mini-stats__icon" aria-hidden="true">
            <AdminIcon name="tag" />
          </span>
          <div>
            <strong>{activeCount}</strong>
            <em>categorias ativas</em>
          </div>
        </article>
        <article>
          <span className="admin-mini-stats__icon" aria-hidden="true">
            <AdminIcon name="stock" />
          </span>
          <div>
            <strong>{rootCount}</strong>
            <em>categorias principais</em>
          </div>
        </article>
        <article>
          <span className="admin-mini-stats__icon" aria-hidden="true">
            <AdminIcon name="list" />
          </span>
          <div>
            <strong>{childCount}</strong>
            <em>subcategorias</em>
          </div>
        </article>
      </section>

      <div className="admin-table-card admin-category-tree">
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
              {tree.map((root) => {
                const childRows = root.children || []
                const isOpen = Boolean(expanded[root.id])
                const rootBounds = siblingBounds(tree, root.id)

                return (
                  <CategoryGroup
                    key={root.id}
                    root={root}
                    childRows={childRows}
                    isOpen={isOpen}
                    rootBounds={rootBounds}
                    pendingId={pendingId}
                    onToggleExpand={() => toggleExpanded(root.id)}
                    onMove={onMove}
                    CategoryActions={CategoryActions}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
        <footer className="admin-table-foot">
          <p>
            <AdminIcon name="info" />
            Expanda uma categoria principal para ver e gerenciar as subcategorias.
            Use as setas para reordenar no mesmo nível.
          </p>
        </footer>
      </div>

      <ul className="admin-card-list admin-category-tree-cards" aria-label="Lista de categorias">
        {tree.map((root) => {
          const childRows = root.children || []
          const isOpen = Boolean(expanded[root.id])
          const rootBounds = siblingBounds(tree, root.id)
          return (
            <li key={root.id} className="admin-card-item admin-card-item--text">
              <div className="admin-card-item__body">
                <button
                  type="button"
                  className="admin-category-tree__toggle admin-category-tree__toggle--block"
                  aria-expanded={isOpen}
                  onClick={() => toggleExpanded(root.id)}
                >
                  <AdminIcon name={isOpen ? 'up' : 'down'} />
                  <span>
                    <strong>{root.name}</strong>
                    <em className="admin-muted">
                      {childRows.length
                        ? `${childRows.length} subcategoria${childRows.length === 1 ? '' : 's'}`
                        : 'sem subcategorias'}
                    </em>
                  </span>
                </button>
                <p className="admin-muted">{root.slug}</p>
                <p>
                  Ordem {root.sortOrder} · {root.active ? 'Ativa' : 'Inativa'}
                </p>
                <CategoryActions category={root} showAddSubcategory />
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="admin-link-btn"
                    disabled={pendingId === root.id || rootBounds.isFirst}
                    onClick={() => onMove(root, 'up')}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-link-btn"
                    disabled={pendingId === root.id || rootBounds.isLast}
                    onClick={() => onMove(root, 'down')}
                  >
                    ↓
                  </button>
                </div>

                {isOpen ? (
                  <ul className="admin-category-tree__mobile-children">
                    {childRows.length === 0 ? (
                      <li className="admin-muted">
                        Nenhuma subcategoria ainda.{' '}
                        <Link
                          href={`/admin/categorias/novo?parentId=${encodeURIComponent(root.id)}`}
                        >
                          Adicionar
                        </Link>
                      </li>
                    ) : (
                      childRows.map((child) => {
                        const bounds = siblingBounds(childRows, child.id)
                        return (
                          <li key={child.id}>
                            <strong>{child.name}</strong>
                            <p className="admin-muted">{child.slug}</p>
                            <p>
                              Ordem {child.sortOrder} ·{' '}
                              {child.active ? 'Ativa' : 'Inativa'}
                            </p>
                            <CategoryActions category={child} />
                            <div className="admin-row-actions">
                              <button
                                type="button"
                                className="admin-link-btn"
                                disabled={pendingId === child.id || bounds.isFirst}
                                onClick={() => onMove(child, 'up')}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="admin-link-btn"
                                disabled={pendingId === child.id || bounds.isLast}
                                onClick={() => onMove(child, 'down')}
                              >
                                ↓
                              </button>
                            </div>
                          </li>
                        )
                      })
                    )}
                  </ul>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function CategoryGroup({
  root,
  childRows,
  isOpen,
  rootBounds,
  pendingId,
  onToggleExpand,
  onMove,
  CategoryActions,
}) {
  return (
    <>
      <tr className="admin-category-tree__root">
        <td>
          <div className="admin-product-cell admin-category-tree__name">
            <button
              type="button"
              className="admin-category-tree__toggle"
              aria-expanded={isOpen}
              aria-label={
                isOpen
                  ? `Recolher subcategorias de ${root.name}`
                  : `Expandir subcategorias de ${root.name}`
              }
              onClick={onToggleExpand}
            >
              <AdminIcon name={isOpen ? 'up' : 'down'} />
            </button>
            <div className="admin-thumb">
              <AdminIcon name="categories" />
            </div>
            <div>
              <strong>{root.name}</strong>
              <p className="admin-category-tree__meta admin-muted">
                {childRows.length
                  ? `${childRows.length} subcategoria${childRows.length === 1 ? '' : 's'}`
                  : 'Sem subcategorias'}
              </p>
            </div>
          </div>
        </td>
        <td>
          <span className="admin-muted">{root.slug}</span>
        </td>
        <td>
          <StatusBadge active={root.active} />
        </td>
        <td>
          <OrderControls
            pending={pendingId === root.id}
            bounds={rootBounds}
            sortOrder={root.sortOrder}
            onUp={() => onMove(root, 'up')}
            onDown={() => onMove(root, 'down')}
          />
        </td>
        <td>
          <CategoryActions category={root} showAddSubcategory />
        </td>
      </tr>

      {isOpen ? (
        childRows.length === 0 ? (
          <tr className="admin-category-tree__empty">
            <td colSpan={5}>
              <div className="admin-category-tree__empty-row">
                <span className="admin-muted">
                  Nenhuma subcategoria em {root.name} ainda.
                </span>
                <Link
                  href={`/admin/categorias/novo?parentId=${encodeURIComponent(root.id)}`}
                  className="admin-link-btn"
                >
                  <AdminIcon name="plus" />
                  Adicionar subcategoria
                </Link>
              </div>
            </td>
          </tr>
        ) : (
          childRows.map((child) => {
            const bounds = siblingBounds(childRows, child.id)
            return (
              <tr key={child.id} className="admin-category-tree__child">
                <td>
                  <div className="admin-product-cell admin-category-tree__child-name">
                    <span className="admin-category-tree__branch" aria-hidden="true">
                      └
                    </span>
                    <strong>{child.name}</strong>
                  </div>
                </td>
                <td>
                  <span className="admin-muted">{child.slug}</span>
                </td>
                <td>
                  <StatusBadge active={child.active} />
                </td>
                <td>
                  <OrderControls
                    pending={pendingId === child.id}
                    bounds={bounds}
                    sortOrder={child.sortOrder}
                    onUp={() => onMove(child, 'up')}
                    onDown={() => onMove(child, 'down')}
                  />
                </td>
                <td>
                  <CategoryActions category={child} />
                </td>
              </tr>
            )
          })
        )
      ) : null}
    </>
  )
}
