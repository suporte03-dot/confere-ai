import { BRAND_HERO_BOARD_SRC, heroContent } from '../../data/homeData'
import TerraEstiloWordmark from './TerraEstiloWordmark'

function HeroSection() {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-section__texture" aria-hidden="true" />

      <div className="container hero-section__grid">
        <div className="hero-section__content">
          <span className="hero-section__badge">{heroContent.badge}</span>
          <h1 className="hero-section__title">{heroContent.title}</h1>
          <p className="hero-section__subtitle">{heroContent.subtitle}</p>
          <div className="hero-section__actions">
            <a href="#produtos" className="btn btn--primary">
              {heroContent.primaryCta}
            </a>
            <a href="#sobre" className="btn btn--outline">
              {heroContent.secondaryCta}
            </a>
          </div>
        </div>

        <figure className="hero-brand-board">
          <div className="hero-brand-board__frame">
            <img
              src={BRAND_HERO_BOARD_SRC}
              alt={heroContent.boardAlt}
              className="hero-brand-board__img"
              loading="eager"
              decoding="async"
            />
            <div className="hero-brand-board__name" aria-hidden="true">
              <TerraEstiloWordmark variant="on-cream" className="hero-brand-board__wordmark" />
            </div>
          </div>
        </figure>
      </div>
    </section>
  )
}

export default HeroSection
