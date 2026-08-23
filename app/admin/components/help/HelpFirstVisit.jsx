'use client'

import { useEffect, useState } from 'react'
import { helpSeenStorageKey } from '../../../../src/content/adminHelp'
import { AdminIcon } from '../AdminIcons'

/**
 * Optional first-visit tip. Does not auto-open the help drawer.
 * @param {{ topic: string, onOpenHelp: () => void }} props
 */
export default function HelpFirstVisit({ topic, onOpenHelp }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const key = helpSeenStorageKey(topic)
      if (window.localStorage.getItem(key) === '1') return
      setVisible(true)
    } catch {
      /* private mode / blocked storage — skip tip */
    }
  }, [topic])

  function dismiss() {
    try {
      window.localStorage.setItem(helpSeenStorageKey(topic), '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  function openAndDismiss() {
    dismiss()
    onOpenHelp()
  }

  if (!visible) return null

  return (
    <div className="admin-help-first" role="status">
      <p>
        <AdminIcon name="help" />
        Primeira vez aqui? Veja como funciona.
      </p>
      <div className="admin-help-first__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={openAndDismiss}>
          Ver ajuda
        </button>
        <button type="button" className="admin-link-btn" onClick={dismiss} aria-label="Fechar dica">
          Fechar
        </button>
      </div>
    </div>
  )
}
