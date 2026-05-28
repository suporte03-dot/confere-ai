import { useMemo, useState } from 'react'
import { divergences, statusFilterOptions } from '../data/mockData'
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
    return {
      total: divergences.length,
      ok,
      divergent,
      missing,
      totalDiff: formatCurrency(totalDiff),
    }
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
    <section id="resultado" className="section results">
      <div className="container">
        <div className="section__header">
          <span className="badge badge--cyan">Resultado simulado</span>
          <h2 className="section__title">Relatório de divergências</h2>
          <p className="section__subtitle">
            Visualize diferenças entre arquivos de forma clara, com filtros, totais e
            exportação pronta para auditoria.
          </p>
        </div>

        <div className="results__toolbar">
          <div className="results__summary">
            <div className="results__summary-item">
              <span className="results__summary-value">{stats.total}</span>
              <span className="results__summary-label">Conferidos</span>
            </div>
            <div className="results__summary-item results__summary-item--ok">
              <span className="results__summary-value">{stats.ok}</span>
              <span className="results__summary-label">OK</span>
            </div>
            <div className="results__summary-item results__summary-item--divergent">
              <span className="results__summary-value">{stats.divergent}</span>
              <span className="results__summary-label">Divergentes</span>
            </div>
            <div className="results__summary-item results__summary-item--missing">
              <span className="results__summary-value">{stats.missing}</span>
              <span className="results__summary-label">Faltantes</span>
            </div>
            <div className="results__summary-item results__summary-item--total">
              <span className="results__summary-value">{stats.totalDiff}</span>
              <span className="results__summary-label">Diferença total</span>
            </div>
          </div>

          <div className="results__actions">
            <label className="results__filter">
              <span>Status</span>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                {statusFilterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => handleExport('excel')}>
              <IconExport />
              Exportar Excel
            </button>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => handleExport('report')}>
              Baixar relatório
            </button>
          </div>
        </div>

        <div className="results__table-wrapper">
          {filteredRows.length === 0 ? (
            <p className="results__empty">Nenhum registro encontrado para o filtro selecionado.</p>
          ) : (
          <table className="results__table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Número</th>
                <th className="results__align-right">Valor Arquivo A</th>
                <th className="results__align-right">Valor Arquivo B</th>
                <th className="results__align-right">Diferença</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={`results__row results__row--${row.status.toLowerCase()}`}>
                  <td>{row.documento}</td>
                  <td className="results__mono">{row.numero}</td>
                  <td className="results__align-right results__mono">{row.valorA}</td>
                  <td className="results__align-right results__mono">{row.valorB}</td>
                  <td
                    className={`results__align-right results__mono results__diff ${
                      row.rawDiff > 0 ? 'results__diff--alert' : ''
                    }`}
                  >
                    {row.diferenca}
                  </td>
                  <td>
                    <span className={`status ${statusClass[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </section>
  )
}

export default ResultsTable
