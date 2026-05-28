import { useCases } from '../data/mockData'

const tagColors = {
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
          <span className="badge">Exemplos de uso</span>
          <h2 className="section__title">Cenários reais de conferência</h2>
          <p className="section__subtitle">
            Veja como equipes fiscais, contábeis e financeiras usam o ConfereAI no dia a dia.
          </p>
        </div>

        <div className="examples__grid">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              className={`example-card example-card--${tagColors[useCase.tag] || 'default'}`}
            >
              <div className="example-card__top">
                <span className="example-card__tag">{useCase.tag}</span>
                <span className="example-card__benefit">{useCase.benefit}</span>
              </div>
              <h3 className="example-card__title">{useCase.title}</h3>
              <p className="example-card__description">{useCase.description}</p>
              <a href="#upload" className="btn btn--ghost btn--sm example-card__btn">
                Experimentar
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Examples
