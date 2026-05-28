import { features } from '../data/mockData'
import { FeatureIcon } from './icons/FeatureIcons'

function Features() {
  return (
    <section id="funcionalidades" className="section features">
      <div className="container">
        <div className="section__header">
          <span className="badge">Funcionalidades</span>
          <h2 className="section__title">Tudo que você precisa para conferir com precisão</h2>
          <p className="section__subtitle">
            Ferramentas especializadas para comparar, validar e gerar relatórios de
            arquivos fiscais, contábeis e financeiros — sem retrabalho manual.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`feature-card ${feature.featured ? 'feature-card--featured' : ''}`}
            >
              {feature.featured && <span className="feature-card__badge">Mais usado</span>}
              <div className="feature-card__icon-wrap">
                <FeatureIcon name={feature.icon} />
              </div>
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
