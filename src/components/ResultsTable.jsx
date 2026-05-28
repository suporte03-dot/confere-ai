import { useMemo, useState } from 'react'
import { divergences, statusFilterOptions, analysisInsights } from '../data/mockData'
import { IconExport } from './icons/FeatureIcons'

const statusClass = {
  OK: 'status--ok',
  Divergente: 'status--divergent',
  Faltante: 'status--missing',
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function ResultsTable({ showToast }) {
  const [filter, setFilter] = useState('Todos')

  const stats = useMemo(() => {
    const ok = divergences.filter((d) => d.status === 'OK').length
    const divergent = divergences.filter((d) => d.status === 'Divergente').length
    const missing = divergences.filter((d) => d.status === 'Faltante').length
    const totalDiff = divergences.reduce((sum, d) => sum + d.rawDiff, 0)
    return { total: divergences.length, ok, divergent, missing, totalDiff: formatCurrency(totalDiff) }
  }, [])

  const filteredRows = useMemo(() => {
    if (filter === 'Todos') return divergences
    return divergences.filter((row) => row.status === filter)
  }, [filter])

  const handleExport = (type) => {
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
          <span className="eyebrow eyebrow--light">Resultado simulado</span>
          <h2 className="section__title section__title--light">Dashboard de divergências</h2>
          <p className="section__subtitle section__subtitle--light">
            Visão executiva com filtros, totais, insights e exportação pronta para auditoria.
          </p>
        </div>

        <div className="results-dashboard">
          <div className="results-dashboard__top">
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-card__value">{stats.total}</span>
                <span className="kpi-card__label">Conferidos</span>
              </div>
              <div className="kpi-card kpi-card--ok">
                <span className="kpi-card__value">{stats.ok}</span>
                <span className="kpi-card__label">OK</span>
              </div>
              <div className="kpi-card kpi-card--warn">
                <span className="kpi-card__value">{stats.divergent}</span>
                <span className="kpi-card__label">Divergentes</span>
              </div>
              <div className="kpi-card kpi-card--danger">
                <span className="kpi-card__value">{stats.missing}</span>
                <span className="kpi-card__label">Faltantes</span>
              </div>
              <div className="kpi-card kpi-card--accent">
                <span className="kpi-card__value">{stats.totalDiff}</span>
                <span className="kpi-card__label">Diferença total</span>
              </div>
            </div>

            <div className="insights-panel">
              <p className="insights-panel__title">Insights da análise</p>
              <ul className="insights-panel__list">
                {analysisInsights.map((item) => (
                  <li key={item.label} className={`insights-panel__item insights-panel__item--${item.tone}`}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="results-dashboard__toolbar">
            <div className="filter-pills" role="group" aria-label="Filtrar por status">
              {statusFilterOptions.map((option) => (
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
            {filteredRows.length === 0 ? (
              <p className="table-panel__empty">Nenhum registro encontrado para o filtro selecionado.</p>
            ) : (
              <div className="table-panel__scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Número</th>
                      <th className="data-table__right">Valor Arquivo A</th>
                      <th className="data-table__right">Valor Arquivo B</th>
                      <th className="data-table__right">Diferença</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className={`data-table__row data-table__row--${row.status.toLowerCase()}`}>
                        <td>{row.documento}</td>
                        <td className="data-table__mono">{row.numero}</td>
                        <td className="data-table__right data-table__mono">{row.valorA}</td>
                        <td className="data-table__right data-table__mono">{row.valorB}</td>
                        <td className={`data-table__right data-table__mono ${row.rawDiff > 0 ? 'data-table__alert' : ''}`}>
                          {row.diferenca}
                        </td>
                        <td>
                          <span className={`status ${statusClass[row.status]}`}>{row.status}</span>
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
