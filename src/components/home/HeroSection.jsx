import { heroContent, footerHome } from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'

function HeroSection() {
  const whatsappHref = footerHome.atendimento.whatsappHref

  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__bg">
        <img
          src={assetUrl('/images/terra-estilo-hero.jpg')}
          alt={heroContent.imageAlt}
          className="hero-section__image"
          width={1920}
          height={1383}
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-section__media-overlay" aria-hidden="true" />
      </div>

      <div className="hero-section__inner">
        <div className="hero-section__panel">
          <div className="hero-section__particles" aria-hidden="true" />

          <div className="hero-section__copy">
            <h1 id="hero-title" className="hero-section__title">
              {heroContent.title}
            </h1>
            <p className="hero-section__support">{heroContent.support}</p>

            <div className="hero-section__actions">
              <a href="#produtos" className="btn btn--primary">
                {heroContent.primaryCta}
              </a>
              <a
                href={whatsappHref}
                className="btn btn--outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {heroContent.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
