import { useCases } from '../data/mockData'

const tagMap = {
  Fiscal: 'fiscal',
  Contábil: 'contabil',
  Financeiro: 'financeiro',
  RH: 'rh',
}

function Examples() {
  return (
    <section id="exemplos" className="section examples">
      <div className="container">
        <div className="section__header">
          <span className="eyebrow eyebrow--blue">Exemplos de uso</span>
          <h2 className="section__title">Casos reais de negócio</h2>
          <p className="section__subtitle">
            Cenários que equipes fiscais, contábeis e financeiras resolvem todos os dias.
          </p>
        </div>

        <div className="examples__grid">
          {useCases.map((item) => (
            <article key={item.title} className={`case-card case-card--${tagMap[item.tag] || 'default'}`}>
              <div className="case-card__head">
                <span className="case-card__tag">{item.tag}</span>
              </div>
              <h3 className="case-card__title">{item.title}</h3>
              <p className="case-card__problem">
                <span>Problema</span>
                {item.problem}
              </p>
              <p className="case-card__desc">{item.description}</p>
              <p className="case-card__outcome">
                <span>Resultado</span>
                {item.outcome}
              </p>
              <div className="case-card__actions">
                <a href="#upload" className="btn btn--primary btn--sm">
                  Experimentar
                </a>
                <a href="#resultado" className="btn btn--ghost btn--sm">
                  Ver exemplo
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Examples
