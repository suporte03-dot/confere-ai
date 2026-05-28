import { divergences } from '../data/mockData'

const statusClass = {
  OK: 'status--ok',
  Divergente: 'status--divergent',
  Faltante: 'status--missing',
}

function ResultsTable() {
  const okCount = divergences.filter((d) => d.status === 'OK').length
  const divergentCount = divergences.filter((d) => d.status === 'Divergente').length
  const missingCount = divergences.filter((d) => d.status === 'Faltante').length

  return (
    <section id="resultado" className="section results">
      <div className="container">
        <div className="section__header">
          <span className="badge">Resultado simulado</span>
          <h2 className="section__title">Relatório de divergências</h2>
          <p className="section__subtitle">
            Visualize como o ConfereAI apresenta diferenças entre arquivos de forma clara e acionável.
          </p>
        </div>

        <div className="results__summary">
          <div className="results__summary-item results__summary-item--ok">
            <span className="results__summary-value">{okCount}</span>
            <span className="results__summary-label">Conferidos</span>
          </div>
          <div className="results__summary-item results__summary-item--divergent">
            <span className="results__summary-value">{divergentCount}</span>
            <span className="results__summary-label">Divergentes</span>
          </div>
          <div className="results__summary-item results__summary-item--missing">
            <span className="results__summary-value">{missingCount}</span>
            <span className="results__summary-label">Faltantes</span>
          </div>
        </div>

        <div className="results__table-wrapper">
          <table className="results__table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Número</th>
                <th>Valor Arquivo A</th>
                <th>Valor Arquivo B</th>
                <th>Diferença</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {divergences.map((row) => (
                <tr key={row.id}>
                  <td data-label="Documento">{row.documento}</td>
                  <td data-label="Número">{row.numero}</td>
                  <td data-label="Valor Arquivo A">{row.valorA}</td>
                  <td data-label="Valor Arquivo B">{row.valorB}</td>
                  <td data-label="Diferença" className="results__diff">{row.diferenca}</td>
                  <td data-label="Status">
                    <span className={`status ${statusClass[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ResultsTable
