import { useEffect, useRef, useState } from 'react'

function DesktopIcon() {
  return (
    <svg className="preview-dropdown__icon" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 20h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg className="preview-dropdown__icon" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" />
    </svg>
  )
}

function PreviewControls({ previewMode, setPreviewMode }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const selectMode = (mode) => {
    setPreviewMode(mode)
    setOpen(false)
  }

  return (
    <div ref={menuRef} className={`preview-menu ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="preview-menu-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="preview-mode-menu"
        aria-haspopup="menu"
        title="Alternar modo de visualização"
      >
        Visualização <span className="preview-menu-button__chevron" aria-hidden="true">▾</span>
      </button>

      <div
        id="preview-mode-menu"
        className={`preview-dropdown ${open ? 'is-open' : ''}`}
        role="menu"
        aria-label="Modo de visualização"
        aria-hidden={!open}
      >
        <button
          type="button"
          role="menuitemradio"
          className={`preview-dropdown__option ${previewMode === 'desktop' ? 'active' : ''}`}
          onClick={() => selectMode('desktop')}
          aria-checked={previewMode === 'desktop'}
          tabIndex={open ? 0 : -1}
        >
          <DesktopIcon />
          <span>Computador</span>
        </button>
        <button
          type="button"
          role="menuitemradio"
          className={`preview-dropdown__option ${previewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => selectMode('mobile')}
          aria-checked={previewMode === 'mobile'}
          tabIndex={open ? 0 : -1}
        >
          <MobileIcon />
          <span>Celular</span>
        </button>
      </div>
    </div>
  )
}

export default PreviewControls
