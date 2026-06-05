import { heroContent } from '../../data/homeData'
import HeroBrandBoard from './HeroBrandBoard'

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

        <HeroBrandBoard />
      </div>
    </section>
  )
}

export default HeroSection
