import { mockUploadedFiles } from '../data/mockData'

const typeColors = {
  PDF: '#ef4444',
  Excel: '#22c55e',
  XML: '#3b82f6',
}

function UploadCard() {
  return (
    <div className="upload-card">
      <div className="upload-card__dropzone">
        <div className="upload-card__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M24 20v12M18 26l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="upload-card__title">Arraste seus arquivos aqui</p>
        <p className="upload-card__formats">PDF, Excel, XML, CSV ou OFX</p>
        <button type="button" className="btn btn--secondary">
          Selecionar arquivos
        </button>
      </div>

      <div className="upload-card__files">
        <p className="upload-card__files-label">Arquivos enviados</p>
        <div className="upload-card__file-list">
          {mockUploadedFiles.map((file) => (
            <div key={file.id} className="file-mini-card">
              <div
                className="file-mini-card__type"
                style={{ backgroundColor: typeColors[file.type] || '#64748b' }}
              >
                {file.type}
              </div>
              <div className="file-mini-card__info">
                <span className="file-mini-card__name">{file.name}</span>
                <span className="file-mini-card__meta">{file.size}</span>
              </div>
              <span
                className={`file-mini-card__status file-mini-card__status--${file.status === 'Pronto' ? 'ready' : 'processing'}`}
              >
                {file.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UploadCard
