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
  const [activeTab, setActiveTab] = useState('conferencia')

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

  const { progress, ok, divergent, missing, elapsed } = analysisSummary

  return (
    <div className="dashboard">
      <div className="dashboard__chrome">
        <span className="dashboard__dot dashboard__dot--red" />
        <span className="dashboard__dot dashboard__dot--amber" />
        <span className="dashboard__dot dashboard__dot--green" />
        <span className="dashboard__chrome-title">ConfereAI · Painel de conferência</span>
        <span className="dashboard__chrome-status">
          <span className="pulse-dot" aria-hidden="true" />
          Processando
        </span>
      </div>

      <div className="dashboard__tabs" role="tablist" aria-label="Abas do painel">
        {['conferencia', 'arquivos', 'resumo'].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'conferencia' && 'Conferência'}
            {tab === 'arquivos' && 'Arquivos'}
            {tab === 'resumo' && 'Resumo'}
          </button>
        ))}
      </div>

      <div className="dashboard__body">
        <div className="dashboard__dropzone">
          <div className="dashboard__dropzone-icon" aria-hidden="true">
            <IconUpload />
          </div>
          <div>
            <p className="dashboard__dropzone-title">Arraste seus arquivos aqui</p>
            <p className="dashboard__dropzone-meta">PDF, Excel, XML, CSV ou OFX</p>
          </div>
          <button type="button" className="btn btn--secondary btn--sm" onClick={handleSelectFiles}>
            Selecionar arquivos
          </button>
        </div>

        <div className="dashboard__progress">
          <div className="dashboard__progress-head">
            <span>Analisando documentos...</span>
            <strong>{progress}%</strong>
          </div>
          <div
            className="dashboard__progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="dashboard__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="dashboard__progress-foot">Tempo estimado: {elapsed}</p>
        </div>

        <div className="dashboard__stats">
          <div className="stat-pill stat-pill--ok">
            <span className="stat-pill__value">{ok}</span>
            <span className="stat-pill__label">OK</span>
          </div>
          <div className="stat-pill stat-pill--warn">
            <span className="stat-pill__value">{divergent}</span>
            <span className="stat-pill__label">Divergentes</span>
          </div>
          <div className="stat-pill stat-pill--danger">
            <span className="stat-pill__value">{missing}</span>
            <span className="stat-pill__label">Faltantes</span>
          </div>
          <div className="dashboard__sparkline" aria-hidden="true">
            <div className="sparkline-bar sparkline-bar--ok" style={{ height: '42%' }} />
            <div className="sparkline-bar sparkline-bar--warn" style={{ height: '68%' }} />
            <div className="sparkline-bar sparkline-bar--danger" style={{ height: '52%' }} />
            <div className="sparkline-bar sparkline-bar--ok" style={{ height: '88%' }} />
          </div>
        </div>

        <div className="dashboard__files">
          <div className="dashboard__files-head">
            <span>Arquivos enviados</span>
            <span className="dashboard__files-count">{files.length} itens</span>
          </div>
          <div className="dashboard__file-list">
            {files.map((file) => (
              <div key={file.id} className="file-row">
                <span
                  className="file-row__type"
                  style={{ backgroundColor: typeColors[file.type] || '#64748B' }}
                >
                  {file.type}
                </span>
                <div className="file-row__info">
                  <span className="file-row__name">{file.name}</span>
                  <span className="file-row__meta">{file.size}</span>
                </div>
                <span className={`file-row__status file-row__status--${statusClass[file.status] || 'ready'}`}>
                  {file.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadCard
