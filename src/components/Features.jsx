import { features } from '../data/mockData'

function Features() {
  return (
    <section id="funcionalidades" className="section features">
      <div className="container">
        <div className="section__header">
          <span className="badge badge--green">Funcionalidades</span>
          <h2 className="section__title">Tudo que você precisa para conferir com precisão</h2>
          <p className="section__subtitle">
            Ferramentas especializadas para comparar, validar e gerar relatórios de
            arquivos fiscais, contábeis e financeiros.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
