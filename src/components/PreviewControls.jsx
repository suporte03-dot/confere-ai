function PreviewControls({ previewMode, setPreviewMode }) {
  return (
    <div className="header-preview-switch" role="toolbar" aria-label="Modo de visualização">
      <button
        type="button"
        className={previewMode === 'desktop' ? 'active' : ''}
        onClick={() => setPreviewMode('desktop')}
        aria-pressed={previewMode === 'desktop'}
        title="Visualização em computador"
      >
        🖥️ Computador
      </button>
      <button
        type="button"
        className={previewMode === 'mobile' ? 'active' : ''}
        onClick={() => setPreviewMode('mobile')}
        aria-pressed={previewMode === 'mobile'}
        title="Visualização em celular"
      >
        📱 Celular
      </button>
    </div>
  )
}

export default PreviewControls
