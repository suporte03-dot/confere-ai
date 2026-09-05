'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_COLLECTION_NAME_SUGGESTIONS,
  buildCollectionNameOptions,
} from '../../../../src/lib/admin/collection-name'

function optionKey(item) {
  return `${item.kind}:${item.id || item.name}`
}

export default function CollectionNameCombobox({
  id = 'collection-name',
  value,
  existingCollections = [],
  excludeId = null,
  suggestions = DEFAULT_COLLECTION_NAME_SUGGESTIONS,
  disabled = false,
  required = false,
  onChange,
  onSelectExisting,
  onSelectCreate,
}) {
  const listboxId = useId()
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const sections = useMemo(
    () =>
      buildCollectionNameOptions({
        existingCollections,
        suggestions,
        query: value,
        excludeId,
      }),
    [existingCollections, suggestions, value, excludeId],
  )

  const flatOptions = useMemo(() => {
    const rows = []
    for (const item of sections.existing) {
      rows.push({ kind: 'existing', id: item.id, name: item.name, slug: item.slug })
    }
    for (const item of sections.suggestions) {
      rows.push({ kind: 'suggestion', name: item.name })
    }
    if (sections.createLabel) {
      rows.push({ kind: 'create', name: sections.createLabel })
    }
    return rows
  }, [sections])

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    setHighlight((current) => {
      if (!flatOptions.length) return 0
      return Math.min(current, flatOptions.length - 1)
    })
  }, [flatOptions])

  function commitOption(option) {
    if (!option) return
    if (option.kind === 'existing') {
      onSelectExisting?.(option)
    } else if (option.kind === 'create') {
      onSelectCreate?.(option.name)
    } else {
      onChange?.(option.name)
    }
    setOpen(false)
    inputRef.current?.focus()
  }

  function onInputKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setHighlight(0)
        return
      }
      setHighlight((current) =>
        flatOptions.length ? (current + 1) % flatOptions.length : 0,
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setHighlight(Math.max(flatOptions.length - 1, 0))
        return
      }
      setHighlight((current) =>
        flatOptions.length
          ? (current - 1 + flatOptions.length) % flatOptions.length
          : 0,
      )
      return
    }

    if (event.key === 'Enter' && open && flatOptions[highlight]) {
      event.preventDefault()
      commitOption(flatOptions[highlight])
      return
    }

    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        setOpen(false)
      }
    }
  }

  const activeDescendant =
    open && flatOptions[highlight] ? `${listboxId}-${highlight}` : undefined

  return (
    <div className="admin-combobox" ref={rootRef}>
      <div className="admin-combobox__control">
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          value={value}
          disabled={disabled}
          required={required}
          autoComplete="off"
          placeholder="Digite ou selecione..."
          onChange={(event) => {
            onChange?.(event.target.value)
            setOpen(true)
            setHighlight(0)
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
        />
        <button
          type="button"
          className="admin-combobox__toggle"
          tabIndex={-1}
          aria-label={open ? 'Fechar sugestões' : 'Abrir sugestões'}
          disabled={disabled}
          onClick={() => {
            setOpen((current) => !current)
            inputRef.current?.focus()
          }}
        >
          <span aria-hidden="true">{open ? '▴' : '▾'}</span>
        </button>
      </div>

      {open ? (
        <div
          id={listboxId}
          className="admin-combobox__panel"
          role="listbox"
          aria-label="Sugestões de nome da coleção"
        >
          {sections.existing.length ? (
            <div className="admin-combobox__group">
              <p className="admin-combobox__group-label">Coleções cadastradas</p>
              {sections.existing.map((item) => {
                const index = flatOptions.findIndex(
                  (row) => row.kind === 'existing' && row.id === item.id,
                )
                const selected = index === highlight
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={selected}
                    className={`admin-combobox__option${selected ? ' is-active' : ''}`}
                    onMouseEnter={() => setHighlight(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                      commitOption({
                        kind: 'existing',
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                      })
                    }
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          ) : null}

          {sections.suggestions.length ? (
            <div className="admin-combobox__group">
              <p className="admin-combobox__group-label">Sugestões</p>
              {sections.suggestions.map((item) => {
                const index = flatOptions.findIndex(
                  (row) => row.kind === 'suggestion' && row.name === item.name,
                )
                const selected = index === highlight
                return (
                  <button
                    key={optionKey({ kind: 'suggestion', name: item.name })}
                    type="button"
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={selected}
                    className={`admin-combobox__option${selected ? ' is-active' : ''}`}
                    onMouseEnter={() => setHighlight(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                      commitOption({ kind: 'suggestion', name: item.name })
                    }
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          ) : null}

          {sections.createLabel ? (
            <div className="admin-combobox__group admin-combobox__group--create">
              <button
                type="button"
                id={`${listboxId}-${flatOptions.length - 1}`}
                role="option"
                aria-selected={highlight === flatOptions.length - 1}
                className={`admin-combobox__option admin-combobox__option--create${
                  highlight === flatOptions.length - 1 ? ' is-active' : ''
                }`}
                onMouseEnter={() => setHighlight(flatOptions.length - 1)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  commitOption({ kind: 'create', name: sections.createLabel })
                }
              >
                + Criar &quot;{sections.createLabel}&quot;
              </button>
            </div>
          ) : null}

          {!flatOptions.length ? (
            <p className="admin-combobox__empty">Nenhuma opção para este texto.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
