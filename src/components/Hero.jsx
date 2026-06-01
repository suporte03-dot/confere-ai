import { heroData } from '../data/mockData'
import VisualMedia from './VisualMedia'

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__decor hero__decor--leaf" aria-hidden="true" />
      <div className="hero__decor hero__decor--fabric" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__content">
          <img
            src="/images/brand/logo-terraestilo-stacked.png"
            alt="TerraEstilo"
            className="hero__logo"
          />
          <span className="hero__label">{heroData.label}</span>
          <h1 className="hero__title">{heroData.title}</h1>
          <p className="hero__subtitle">{heroData.subtitle}</p>
          <div className="hero__actions">
            <a href="#produtos" className="btn btn--primary">{heroData.primaryButton}</a>
            <a href="#sobre" className="btn btn--outline">{heroData.secondaryButton}</a>
          </div>
          <div className="hero__chips">
            {heroData.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__image-wrap">
            <VisualMedia
              src={heroData.image}
              alt="Editorial TerraEstilo — moda premium com identidade do Sul"
              label="Coleção Raízes do Sul"
              variant={heroData.variant}
              className="hero__media"
              imgClassName="hero__image"
              loading="eager"
            />
            <div className="hero__image-overlay" aria-hidden="true" />
          </div>
          {heroData.floatingCards.map((card, index) => (
            <div key={card} className={`hero__card hero__card--float hero__card--${index + 1}`}>
              <span>{card}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
