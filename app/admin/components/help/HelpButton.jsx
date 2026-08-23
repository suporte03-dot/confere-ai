'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { getHelpTopic } from '../../../../src/content/adminHelp'
import { AdminIcon } from '../AdminIcons'
import HelpFirstVisit from './HelpFirstVisit'
import HelpTopicSections from './HelpTopicSections'

/**
 * Contextual help trigger + side panel.
 * @param {{ topic: string, label?: string, className?: string, showFirstVisit?: boolean }} props
 */
export default function HelpButton({
  topic,
  label = 'Ajuda',
  className = '',
  showFirstVisit = true,
}) {
  const [open, setOpen] = useState(false)
  const data = getHelpTopic(topic)

  if (!data) return null

  return (
    <>
      <button
        type="button"
        className={`admin-help-btn${className ? ` ${className}` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <AdminIcon name="help" />
        <span>{label}</span>
      </button>
      <HelpDrawer open={open} topic={topic} onClose={() => setOpen(false)} />
      {showFirstVisit ? (
        <HelpFirstVisit topic={topic} onOpenHelp={() => setOpen(true)} />
      ) : null}
    </>
  )
}

/**
 * Right-side help panel (mirrors StockAlertsPanel pattern).
 * @param {{ open: boolean, topic: string, onClose: () => void }} props
 */
export function HelpDrawer({ open, topic, onClose }) {
  const closeRef = useRef(null)
  const titleId = useId()
  const data = getHelpTopic(topic)

  useEffect(() => {
    if (!open) return undefined
    closeRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('admin-help-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('admin-help-open')
    }
  }, [open, onClose])

  if (!data) return null

  return (
    <>
      <button
        type="button"
        className={`admin-help-overlay${open ? ' is-open' : ''}`}
        aria-label="Fechar ajuda"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={`admin-help-panel${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        aria-labelledby={titleId}
        role="dialog"
      >
        <div className="admin-help-panel__head">
          <div>
            <p className="admin-help-panel__kicker">Ajuda</p>
            <h2 id={titleId}>Ajuda — {data.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="admin-help-panel__close"
            aria-label="Fechar"
            onClick={onClose}
          >
            <AdminIcon name="close" />
          </button>
        </div>

        <div className="admin-help-panel__body">
          <HelpTopicSections topic={data} compact />
          <Link
            href={data.href}
            className="admin-btn admin-help-panel__full"
            onClick={onClose}
          >
            Ver documentação completa
            <AdminIcon name="arrow" />
          </Link>
        </div>
      </aside>
    </>
  )
}
