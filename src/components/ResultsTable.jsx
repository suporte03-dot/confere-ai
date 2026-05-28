import { useMemo, useState } from 'react'
import {
  divergences,
  analysisInsights as mockInsights,
} from '../data/mockData'
import {
  analysisFilterOptions,
  demoFilterOptions,
  formatCurrency,
} from '../utils/fileAnalysis'
import { IconExport } from './icons/FeatureIcons'

const demoStatusClass = {
  OK: 'status--ok',
  Divergente: 'status--divergent',
  Faltante: 'status--missing',
}

const analysisStatusClass = {
  'Lido com sucesso': 'status--ok',
  OK: 'status--ok',
  'Dados incompletos': 'status--divergent',
  'Lido como texto': 'status--info',
  'Layout não identificado': 'status--missing',
  'Não suportado': 'status--missing',
}

function ResultsTable({
  showToast,
  hasRealAnalysis,
  analysisResults,
  analysisStats,
  analysisInsights,
}) {
  const [filter, setFilter] = useState('Todos')

  const filterOptions = hasRealAnalysis ? analysisFilterOptions : demoFilterOptions

  const stats = useMemo(() => {
    if (hasRealAnalysis && analysisStats) {
      return {
        total: analysisStats.sent,
        processed: analysisStats.processed,
        xmlRead: analysisStats.xmlRead,
        errors: analysisStats.errors,
        totalDiff: analysisStats.totalValue,
        ok: analysisStats.ok,
      }
    }

    const ok = divergences.filter((item) => item.status === 'OK').length
    const divergent = divergences.filter((item) => item.status === 'Divergente').length
    const missing = divergences.filter((item) => item.status === 'Faltante').length
    const totalDiff = divergences.reduce((sum, item) => sum + item.rawDiff, 0)

    return {
      total: divergences.length,
      processed: divergences.length,
      xmlRead: ok,
      errors: divergent + missing,
      totalDiff: formatCurrency(totalDiff),
      ok,
    }
  }, [hasRealAnalysis, analysisStats])

  const insights = hasRealAnalysis && analysisInsights ? analysisInsights : mockInsights

  const rows = useMemo(() => {
    if (hasRealAnalysis && analysisResults) {
      if (filter === 'Todos') return analysisResults
      return analysisResults.filter((row) => row.filterKey === filter)
    }

    if (filter === 'Todos') return divergences
    return divergences.filter((row) => row.status === filter)
  }, [hasRealAnalysis, analysisResults, filter])

  const handleExport = (type) => {
    if (!hasRealAnalysis) {
      showToast?.('Execute uma análise real para exportar os dados extraídos.')
      return
    }

    showToast?.(
      type === 'excel'
        ? 'Relatório preparado para exportação em Excel.'
        : 'Relatório pronto para download.',
    )
  }

  return (
    <section id="resultado" className="section section--dark results">
      <div className="container">
        <div className="section__header section__header--light">
          <span className="eyebrow eyebrow--light">
            {hasRealAnalysis ? 'Resultado da análise' : 'Resultado simulado'}
          </span>
          <h2 className="section__title section__title--light">
            {hasRealAnalysis ? 'Relatório de leitura dos arquivos' : 'Dashboard de divergências'}
          </h2>
          <p className="section__subtitle section__subtitle--light">
            {hasRealAnalysis
              ? 'Dados extraídos dos arquivos enviados, com status claro por tipo e layout.'
              : 'Exemplo visual de divergências. Selecione arquivos e clique em Analisar arquivos para ver dados reais.'}
          </p>
        </div>

        <div className="results-dashboard">
          <div className="results-dashboard__top">
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-card__value">{stats.total}</span>
                <span className="kpi-card__label">Arquivos enviados</span>
              </div>
              <div className="kpi-card kpi-card--ok">
                <span className="kpi-card__value">{stats.processed}</span>
                <span className="kpi-card__label">Arquivos processados</span>
              </div>
              <div className="kpi-card kpi-card--warn">
                <span className="kpi-card__value">{stats.xmlRead}</span>
                <span className="kpi-card__label">XMLs lidos</span>
              </div>
              <div className="kpi-card kpi-card--danger">
                <span className="kpi-card__value">{stats.errors}</span>
                <span className="kpi-card__label">Arquivos com erro</span>
              </div>
              <div className="kpi-card kpi-card--accent">
                <span className="kpi-card__value">{stats.totalDiff}</span>
                <span className="kpi-card__label">Valor total identificado</span>
              </div>
            </div>

            <div className="insights-panel">
              <p className="insights-panel__title">Insights da análise</p>
              <ul className="insights-panel__list">
                {insights.map((item) => (
                  <li key={item.label} className={`insights-panel__item insights-panel__item--${item.tone}`}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="results-dashboard__toolbar">
            <div className="filter-pills" role="group" aria-label="Filtrar por status">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`filter-pill ${filter === option ? 'filter-pill--active' : ''}`}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="results-dashboard__actions">
              <button type="button" className="btn btn--outline-light btn--sm" onClick={() => handleExport('excel')}>
                <IconExport />
                Exportar Excel
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => handleExport('report')}>
                Baixar relatório
              </button>
            </div>
          </div>

          <div className="table-panel">
            {rows.length === 0 ? (
              <p className="table-panel__empty">Nenhum registro encontrado para o filtro selecionado.</p>
            ) : (
              <div className="table-panel__scroll">
                <table className="data-table">
                  <thead>
                    {hasRealAnalysis ? (
                      <tr>
                        <th>Tipo</th>
                        <th>Arquivo</th>
                        <th>Número</th>
                        <th>Emitente</th>
                        <th>CNPJ Emitente</th>
                        <th>Destinatário</th>
                        <th className="data-table__right">Valor</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Observação</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>Documento</th>
                        <th>Número</th>
                        <th className="data-table__right">Valor Arquivo A</th>
                        <th className="data-table__right">Valor Arquivo B</th>
                        <th className="data-table__right">Diferença</th>
                        <th>Status</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {hasRealAnalysis
                      ? rows.map((row) => (
                          <tr key={row.id} className="data-table__row">
                            <td>{row.tipo}</td>
                            <td className="data-table__mono">{row.arquivo}</td>
                            <td className="data-table__mono">{row.numero}</td>
                            <td>{row.emitente}</td>
                            <td className="data-table__mono">{row.cnpjEmitente}</td>
                            <td>{row.destinatario}</td>
                            <td className="data-table__right data-table__mono">{row.valor}</td>
                            <td>{row.data}</td>
                            <td>
                              <span className={`status ${analysisStatusClass[row.status] || 'status--info'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="data-table__note">{row.observacao}</td>
                          </tr>
                        ))
                      : rows.map((row) => (
                          <tr key={row.id} className={`data-table__row data-table__row--${row.status.toLowerCase()}`}>
                            <td>{row.documento}</td>
                            <td className="data-table__mono">{row.numero}</td>
                            <td className="data-table__right data-table__mono">{row.valorA}</td>
                            <td className="data-table__right data-table__mono">{row.valorB}</td>
                            <td className={`data-table__right data-table__mono ${row.rawDiff > 0 ? 'data-table__alert' : ''}`}>
                              {row.diferenca}
                            </td>
                            <td>
                              <span className={`status ${demoStatusClass[row.status]}`}>{row.status}</span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResultsTable
