import { useState } from 'react'
import { mockUploadedFiles, analysisSummary } from '../data/mockData'
import { IconUpload } from './icons/FeatureIcons'

const typeColors = {
  PDF: '#EF4444',
  Excel: '#059669',
  XML: '#2563EB',
  CSV: '#64748B',
}

const statusClass = {
  Pronto: 'ready',
  Analisando: 'processing',
  Divergente: 'divergent',
}

function UploadCard({ showToast }) {
  const [files, setFiles] = useState(mockUploadedFiles)

  const handleSelectFiles = () => {
    const newFile = {
      id: Date.now(),
      name: 'novo_arquivo_conferencia.pdf',
      type: 'PDF',
      size: '1,1 MB',
      status: 'Analisando',
    }
    setFiles((prev) => [newFile, ...prev.slice(0, 3)])
    showToast?.('Arquivo adicionado à fila de análise.')
  }

  const { progress, ok, divergent, missing } = analysisSummary

  return (
    <div className="upload-card">
      <div className="upload-card__header">
        <div>
          <p className="upload-card__label">Painel de análise</p>
          <h3 className="upload-card__heading">Conferência em andamento</h3>
        </div>
        <span className="upload-card__live">
          <span className="upload-card__live-dot" aria-hidden="true" />
          Ao vivo
        </span>
      </div>

      <div className="upload-card__dropzone">
        <div className="upload-card__icon" aria-hidden="true">
          <IconUpload />
        </div>
        <p className="upload-card__title">Arraste seus arquivos aqui</p>
        <p className="upload-card__formats">PDF, Excel, XML, CSV ou OFX</p>
        <button type="button" className="btn btn--secondary btn--sm" onClick={handleSelectFiles}>
          Selecionar arquivos
        </button>
      </div>

      <div className="upload-card__progress">
        <div className="upload-card__progress-top">
          <span>Analisando documentos...</span>
          <strong>{progress}%</strong>
        </div>
        <div className="upload-card__progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="upload-card__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="upload-card__mini-summary">
        <div className="upload-card__mini-stat upload-card__mini-stat--ok">
          <span>{ok}</span>
          <small>OK</small>
        </div>
        <div className="upload-card__mini-stat upload-card__mini-stat--warn">
          <span>{divergent}</span>
          <small>Divergentes</small>
        </div>
        <div className="upload-card__mini-stat upload-card__mini-stat--danger">
          <span>{missing}</span>
          <small>Faltantes</small>
        </div>
        <div className="upload-card__mini-chart" aria-hidden="true">
          <div className="upload-card__bar upload-card__bar--ok" style={{ height: '45%' }} />
          <div className="upload-card__bar upload-card__bar--warn" style={{ height: '70%' }} />
          <div className="upload-card__bar upload-card__bar--danger" style={{ height: '55%' }} />
          <div className="upload-card__bar upload-card__bar--ok" style={{ height: '85%' }} />
        </div>
      </div>

      <div className="upload-card__files">
        <p className="upload-card__files-label">Arquivos enviados</p>
        <div className="upload-card__file-list">
          {files.map((file) => (
            <div key={file.id} className="file-mini-card">
              <div
                className="file-mini-card__type"
                style={{ backgroundColor: typeColors[file.type] || '#64748B' }}
              >
                {file.type}
              </div>
              <div className="file-mini-card__info">
                <span className="file-mini-card__name">{file.name}</span>
                <span className="file-mini-card__meta">{file.size}</span>
              </div>
              <span className={`file-mini-card__status file-mini-card__status--${statusClass[file.status] || 'ready'}`}>
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
