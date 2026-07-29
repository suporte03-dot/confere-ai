import { heroContent, BRAND_LOGO_CIRCULAR_SRC, footerHome } from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'
import HeroBrandBoard from './HeroBrandBoard'

function HeroSection() {
  const whatsappHref = footerHome.atendimento.whatsappHref

  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__inner">
        <div className="hero-section__media">
          <img
            src={assetUrl('/images/terra-estilo-hero.jpg')}
            alt={heroContent.imageAlt}
            className="hero-section__image"
            width={1200}
            height={1500}
            decoding="async"
            fetchPriority="high"
          />
          <div className="hero-section__media-overlay" aria-hidden="true" />
        </div>

        <div className="hero-section__panel">
          <div className="hero-section__particles" aria-hidden="true" />

          <div className="hero-section__copy">
            <HeroBrandBoard logoSrc={BRAND_LOGO_CIRCULAR_SRC} />

            <p className="hero-section__label">{heroContent.label}</p>
            <h1 id="hero-title" className="hero-section__title">
              {heroContent.title}
            </h1>
            <p className="hero-section__slogan">{heroContent.slogan}</p>
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
