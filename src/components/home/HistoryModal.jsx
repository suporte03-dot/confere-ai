import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const HISTORY_PARAGRAPHS = [
  'A Terra & Estilo nasceu de um sonho construído em família, com amor pelo campo, respeito às nossas raízes e vontade de criar algo que representasse a força do agro brasileiro.',
  'Mais do que uma marca de roupas, buscamos traduzir em cada peça a autenticidade, a elegância e o orgulho de quem vive essa história todos os dias.',
  'Seguimos crescendo com dedicação, propósito e gratidão por cada pessoa que faz parte dessa caminhada.',
]

function getFocusableElements(container) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

function HistoryModal({ open, onClose }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 0)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(dialogRef.current)
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="history-modal" role="presentation">
      <button
        type="button"
        className="history-modal__backdrop"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="history-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="history-modal__close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        <h2 id={titleId} className="history-modal__title">
          Nossa história
        </h2>
        <span className="history-modal__ornament" aria-hidden="true" />

        <div className="history-modal__body">
          {HISTORY_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default HistoryModal
