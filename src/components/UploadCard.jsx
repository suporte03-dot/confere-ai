import { useRef, useState } from 'react'
import { mockUploadedFiles, analysisSummary } from '../data/mockData'
import { IconUpload } from './icons/FeatureIcons'

const ACCEPTED_EXTENSIONS = ['pdf', 'xlsx', 'xls', 'xml', 'csv', 'ofx']

const typeColors = {
  PDF: '#EF4444',
  Excel: '#059669',
  XML: '#2563EB',
  CSV: '#64748B',
  OFX: '#0B2447',
}

const statusClass = {
  Pronto: 'ready',
  Analisando: 'processing',
  Divergente: 'divergent',
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

function getFileType(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  const map = {
    pdf: 'PDF',
    xlsx: 'Excel',
    xls: 'Excel',
    xml: 'XML',
    csv: 'CSV',
    ofx: 'OFX',
  }
  return map[ext] || ext?.toUpperCase() || 'FILE'
}

function isAcceptedFile(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  return ACCEPTED_EXTENSIONS.includes(ext)
}

function fileKey(file) {
  return `${file.name}-${file.rawSize ?? file.size}`
}

function mapFileToEntry(file, index = 0) {
  return {
    id: `${file.name}-${file.size}-${Date.now()}-${index}`,
    name: file.name,
    type: getFileType(file.name),
    size: formatFileSize(file.size),
    rawSize: file.size,
    status: 'Pronto',
  }
}

function mergeFileEntries(existing, incoming) {
  const merged = new Map()
  existing.forEach((file) => merged.set(fileKey(file), file))
  incoming.forEach((file) => {
    if (!merged.has(fileKey(file))) {
      merged.set(fileKey(file), file)
    }
  })
  return Array.from(merged.values())
}

function UploadCard({ showToast }) {
  const fileInputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('conferencia')
  const [isDragging, setIsDragging] = useState(false)

  const displayFiles = selectedFiles.length > 0 ? selectedFiles : mockUploadedFiles
  const { progress, ok, divergent, missing, elapsed } = analysisSummary

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const addFiles = (fileList) => {
    const accepted = Array.from(fileList).filter((file) => isAcceptedFile(file.name))

    if (accepted.length === 0) {
      showToast?.('Selecione arquivos PDF, Excel, XML, CSV ou OFX.')
      return
    }

    const entries = accepted.map((file, index) => mapFileToEntry(file, index))
    setSelectedFiles((prev) => mergeFileEntries(prev, entries))
    showToast?.(
      accepted.length === 1
        ? '1 arquivo adicionado à lista.'
        : `${accepted.length} arquivos adicionados à lista.`,
    )
  }

  const handleFileChange = (event) => {
    if (event.target.files?.length) {
      addFiles(event.target.files)
    }
    event.target.value = ''
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files)
    }
  }

  return (
    <div className="dashboard">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.xlsx,.xls,.xml,.csv,.ofx"
        className="file-input-hidden"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />

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
        <div
          className={`dashboard__dropzone ${isDragging ? 'dashboard__dropzone--active' : ''}`}
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openFilePicker()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Selecionar ou arrastar arquivos para upload"
        >
          <div className="dashboard__dropzone-icon" aria-hidden="true">
            <IconUpload />
          </div>
          <div>
            <p className="dashboard__dropzone-title">Arraste seus arquivos aqui</p>
            <p className="dashboard__dropzone-meta">PDF, Excel, XML, CSV ou OFX</p>
          </div>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={(event) => {
              event.stopPropagation()
              openFilePicker()
            }}
          >
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
            <span className="dashboard__files-count">
              {displayFiles.length} {selectedFiles.length > 0 ? 'selecionados' : 'itens'}
            </span>
          </div>
          <div className="dashboard__file-list">
            {displayFiles.map((file) => (
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
