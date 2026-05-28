import { useRef, useState } from 'react'
import { mockUploadedFiles } from '../data/mockData'
import { isAcceptedFile } from '../utils/fileAnalysis'
import { IconUpload } from './icons/FeatureIcons'

const typeColors = {
  PDF: '#EF4444',
  Excel: '#059669',
  XML: '#2563EB',
  CSV: '#64748B',
  TXT: '#64748B',
  OFX: '#0B2447',
}

const statusClassMap = {
  'Aguardando análise': 'waiting',
  Processando: 'processing',
  Concluído: 'ready',
  'Não suportado': 'divergent',
  Pronto: 'ready',
  Analisando: 'processing',
  Divergente: 'divergent',
}

function UploadCard({
  showToast,
  uploadedFiles,
  onAddFiles,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
  analysisStats,
}) {
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('conferencia')
  const [isDragging, setIsDragging] = useState(false)

  const hasSelectedFiles = uploadedFiles.length > 0
  const displayFiles = hasSelectedFiles ? uploadedFiles : mockUploadedFiles
  const progress = isAnalyzing ? analysisProgress : hasSelectedFiles ? 0 : 87
  const progressLabel = isAnalyzing
    ? 'Processando arquivos...'
    : hasSelectedFiles
      ? 'Aguardando análise'
      : 'Exemplo de análise em andamento'

  const statOk = analysisStats?.ok ?? (hasSelectedFiles ? 0 : 2)
  const statWarn = analysisStats?.incomplete ?? (hasSelectedFiles ? 0 : 2)
  const statDanger = analysisStats?.errors ?? (hasSelectedFiles ? 0 : 2)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const addFiles = (fileList) => {
    const files = Array.from(fileList)
    if (files.length === 0) return

    const unsupported = files.filter((file) => !isAcceptedFile(file.name))
    onAddFiles?.(files)

    if (unsupported.length === files.length) {
      showToast?.('Formato não suportado. Use PDF, Excel, XML, CSV, TXT ou OFX.')
      return
    }

    showToast?.(
      files.length === 1
        ? '1 arquivo adicionado à lista.'
        : `${files.length} arquivos adicionados à lista.`,
    )
  }

  const handleFileChange = (event) => {
    if (event.target.files?.length) {
      addFiles(event.target.files)
    }
    event.target.value = ''
  }

  const handleAnalyzeClick = () => {
    if (!hasSelectedFiles) {
      showToast?.('Selecione ao menos um arquivo para iniciar a análise.')
      return
    }
    onAnalyze?.()
  }

  return (
    <div className="dashboard">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.xlsx,.xls,.xml,.csv,.txt,.ofx,*/*"
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
          <span className={`pulse-dot ${isAnalyzing ? '' : 'pulse-dot--idle'}`} aria-hidden="true" />
          {isAnalyzing ? 'Processando' : hasSelectedFiles ? 'Pronto para analisar' : 'Demonstração'}
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
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files)
          }}
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
            <p className="dashboard__dropzone-meta">PDF, Excel, XML, CSV, TXT ou OFX</p>
          </div>
          <div className="dashboard__dropzone-actions">
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
            {hasSelectedFiles && (
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={(event) => {
                  event.stopPropagation()
                  handleAnalyzeClick()
                }}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analisando...' : 'Analisar arquivos'}
              </button>
            )}
          </div>
        </div>

        <div className="dashboard__progress">
          <div className="dashboard__progress-head">
            <span>{progressLabel}</span>
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
          <p className="dashboard__progress-foot">
            {hasSelectedFiles
              ? `${uploadedFiles.length} arquivo(s) na fila`
              : 'Envie arquivos reais para iniciar a análise'}
          </p>
        </div>

        <div className="dashboard__stats">
          <div className="stat-pill stat-pill--ok">
            <span className="stat-pill__value">{statOk}</span>
            <span className="stat-pill__label">OK</span>
          </div>
          <div className="stat-pill stat-pill--warn">
            <span className="stat-pill__value">{statWarn}</span>
            <span className="stat-pill__label">Pendentes</span>
          </div>
          <div className="stat-pill stat-pill--danger">
            <span className="stat-pill__value">{statDanger}</span>
            <span className="stat-pill__label">Erros</span>
          </div>
          <div className="dashboard__sparkline" aria-hidden="true">
            <div className="sparkline-bar sparkline-bar--ok" style={{ height: `${Math.max(statOk * 20, 20)}%` }} />
            <div className="sparkline-bar sparkline-bar--warn" style={{ height: `${Math.max(statWarn * 20, 30)}%` }} />
            <div className="sparkline-bar sparkline-bar--danger" style={{ height: `${Math.max(statDanger * 20, 25)}%` }} />
            <div className="sparkline-bar sparkline-bar--ok" style={{ height: '60%' }} />
          </div>
        </div>

        <div className="dashboard__files">
          <div className="dashboard__files-head">
            <span>Arquivos enviados</span>
            <span className="dashboard__files-count">
              {displayFiles.length} {hasSelectedFiles ? 'selecionados' : 'exemplo'}
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
                  <span className="file-row__meta">{file.sizeLabel || file.size}</span>
                </div>
                <span
                  className={`file-row__status file-row__status--${statusClassMap[file.status] || 'waiting'}`}
                >
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
