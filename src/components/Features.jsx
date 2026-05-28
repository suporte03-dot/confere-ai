import { features } from '../data/mockData'
import { FeatureIcon } from './icons/FeatureIcons'

function Features() {
  return (
    <section id="funcionalidades" className="section section--alt features">
      <div className="container">
        <div className="section__header">
          <span className="eyebrow eyebrow--blue">Funcionalidades</span>
          <h2 className="section__title">Motor de conferência para arquivos críticos</h2>
          <p className="section__subtitle">
            Ferramentas especializadas para comparar, validar e exportar resultados com
            precisão de auditoria digital.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`feature-card ${feature.featured ? 'feature-card--featured' : ''}`}
            >
              {feature.featured && <span className="feature-card__flag">Mais usado</span>}
              <div className="feature-card__icon">
                <FeatureIcon name={feature.icon} />
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.description}</p>
              <p className="feature-card__benefit">{feature.benefit}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
