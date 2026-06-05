function DesktopIcon() {
  return (
    <svg className="header-preview-switch__icon" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 20h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg className="header-preview-switch__icon" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" />
    </svg>
  )
}

function PreviewControls({ previewMode, setPreviewMode }) {
  return (
    <div className="header-preview-panel">
      <span className="header-preview-panel__label">Visualização</span>
      <div className="header-preview-switch" role="toolbar" aria-label="Modo de visualização">
        <button
          type="button"
          className={`header-preview-switch__option ${previewMode === 'desktop' ? 'active' : ''}`}
          onClick={() => setPreviewMode('desktop')}
          aria-pressed={previewMode === 'desktop'}
          title="Visualização em computador"
        >
          <DesktopIcon />
          <span className="header-preview-switch__text">Computador</span>
        </button>
        <button
          type="button"
          className={`header-preview-switch__option ${previewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => setPreviewMode('mobile')}
          aria-pressed={previewMode === 'mobile'}
          title="Visualização em celular"
        >
          <MobileIcon />
          <span className="header-preview-switch__text">Celular</span>
        </button>
      </div>
    </div>
  )
}

export default PreviewControls
