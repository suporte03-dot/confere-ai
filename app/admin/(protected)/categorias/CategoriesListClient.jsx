'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { moveCategory, toggleCategoryActive, deleteCategory } from './actions'
import { AdminIcon } from '../../components/AdminIcons'
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

function subCountLabel(count) {
  return `${count} subcategoria${count === 1 ? '' : 's'}`
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
    <div className="admin-order-controls admin-order-controls--compact">
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

function CategoryMoreMenu({
  open,
  onOpenChange,
  editHref,
  active,
  pending,
  canDelete,
  onToggleActive,
  onDelete,
  editLabel = 'Editar categoria',
}) {
  const wrapRef = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return undefined
    function onPointer(event) {
      if (!wrapRef.current?.contains(event.target)) onOpenChange(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  return (
    <div className="admin-cat-menu" ref={wrapRef}>
      <button
        type="button"
        className="admin-cat-menu__trigger"
        aria-label="Mais ações"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        disabled={pending}
        onClick={() => onOpenChange(!open)}
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {open ? (
        <div className="admin-cat-menu__panel" role="menu" id={menuId}>
          <Link
            href={editHref}
            role="menuitem"
            className="admin-cat-menu__item"
            onClick={() => onOpenChange(false)}
          >
            {editLabel}
          </Link>
          <button
            type="button"
            role="menuitem"
            className="admin-cat-menu__item"
            disabled={pending}
            onClick={() => {
              onOpenChange(false)
              onToggleActive()
            }}
          >
            {active ? 'Desativar' : 'Ativar'}
          </button>
          {canDelete ? (
            <button
              type="button"
              role="menuitem"
              className="admin-cat-menu__item admin-cat-menu__item--danger"
              disabled={pending}
              onClick={() => {
                onOpenChange(false)
                onDelete()
              }}
            >
              Excluir
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function CategoriesListClient({ categories: initialCategories }) {
  const router = useRouter()
  const [optimistic, setOptimistic] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [menuKey, setMenuKey] = useState(null)
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
        <article>
          <span className="admin-mini-stats__icon" aria-hidden="true">
            <AdminIcon name="tag" />
          </span>
          <div>
            <strong>{activeCount}</strong>
            <em>total ativas</em>
          </div>
        </article>
      </section>

      <div className="admin-category-catalog" role="list">
        {tree.map((root) => {
          const childRows = root.children || []
          const isOpen = Boolean(expanded[root.id])
          const rootBounds = siblingBounds(tree, root.id)
          const addHref = `/admin/categorias/novo?parentId=${encodeURIComponent(root.id)}`
          const pending = pendingId === root.id

          return (
            <article
              key={root.id}
              className={`admin-category-panel${isOpen ? ' is-open' : ''}`}
              role="listitem"
            >
              <header className="admin-category-panel__head">
                <button
                  type="button"
                  className="admin-category-panel__toggle"
                  aria-expanded={isOpen}
                  aria-label={
                    isOpen
                      ? `Recolher ${root.name}`
                      : `Expandir ${root.name}`
                  }
                  onClick={() => toggleExpanded(root.id)}
                >
                  <span aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
                </button>

                <div className="admin-category-panel__title">
                  <strong>{root.name}</strong>
                  <span className="admin-category-panel__count">
                    {subCountLabel(childRows.length)}
                  </span>
                </div>

                <StatusBadge active={root.active} />

                <OrderControls
                  pending={pending}
                  bounds={rootBounds}
                  sortOrder={root.sortOrder}
                  onUp={() => onMove(root, 'up')}
                  onDown={() => onMove(root, 'down')}
                />

                <div className="admin-category-panel__actions">
                  <Link href={addHref} className="admin-category-panel__add">
                    <AdminIcon name="plus" />
                    Subcategoria
                  </Link>
                  <CategoryMoreMenu
                    open={menuKey === `root-${root.id}`}
                    onOpenChange={(next) =>
                      setMenuKey(next ? `root-${root.id}` : null)
                    }
                    editHref={`/admin/categorias/${root.id}`}
                    active={root.active}
                    pending={pending}
                    canDelete={isAuditTestRecord(root)}
                    onToggleActive={() => onToggleActive(root)}
                    onDelete={() => onDelete(root)}
                  />
                </div>
              </header>

              {isOpen ? (
                <div className="admin-category-panel__body">
                  {childRows.length === 0 ? (
                    <div className="admin-category-panel__empty">
                      <p>Nenhuma subcategoria cadastrada.</p>
                      <Link href={addHref} className="admin-category-panel__empty-link">
                        + Adicionar primeira subcategoria
                      </Link>
                    </div>
                  ) : (
                    <ul className="admin-category-panel__children">
                      {childRows.map((child, index) => {
                        const bounds = siblingBounds(childRows, child.id)
                        const isLast = index === childRows.length - 1
                        return (
                          <li key={child.id} className="admin-category-panel__child">
                            <span
                              className="admin-category-panel__branch"
                              aria-hidden="true"
                            >
                              {isLast ? '└' : '├'}
                            </span>
                            <div className="admin-category-panel__child-main">
                              <strong>{child.name}</strong>
                              <span className="admin-muted">{child.slug}</span>
                            </div>
                            <StatusBadge active={child.active} />
                            <OrderControls
                              pending={pendingId === child.id}
                              bounds={bounds}
                              sortOrder={child.sortOrder}
                              onUp={() => onMove(child, 'up')}
                              onDown={() => onMove(child, 'down')}
                            />
                            <CategoryMoreMenu
                              open={menuKey === `child-${child.id}`}
                              onOpenChange={(next) =>
                                setMenuKey(next ? `child-${child.id}` : null)
                              }
                              editHref={`/admin/categorias/${child.id}`}
                              editLabel="Editar subcategoria"
                              active={child.active}
                              pending={pendingId === child.id}
                              canDelete={isAuditTestRecord(child)}
                              onToggleActive={() => onToggleActive(child)}
                              onDelete={() => onDelete(child)}
                            />
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {childRows.length > 0 ? (
                    <div className="admin-category-panel__footer">
                      <Link href={addHref} className="admin-category-panel__empty-link">
                        + Adicionar subcategoria
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </>
  )
}
