import { useCases } from '../data/mockData'

function Examples() {
  return (
    <section id="exemplos" className="section examples">
      <div className="container">
        <div className="section__header">
          <span className="badge badge--green">Exemplos de uso</span>
          <h2 className="section__title">Cenários reais de conferência</h2>
          <p className="section__subtitle">
            Veja como equipes fiscais, contábeis e financeiras usam o ConfereAI no dia a dia.
          </p>
        </div>

        <div className="examples__grid">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="example-card">
              <span className="example-card__tag">{useCase.tag}</span>
              <h3 className="example-card__title">{useCase.title}</h3>
              <p className="example-card__description">{useCase.description}</p>
              <a href="#upload" className="example-card__link">
                Experimentar →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Examples
