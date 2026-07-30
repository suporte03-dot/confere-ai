import { heroContent, footerHome, BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'

const HERO_ASSET_V = '20260729i'
const HERO_IMAGE_SRC = `/images/hero/couple.jpg?v=${HERO_ASSET_V}`

function HeroSection() {
  const whatsappHref = footerHome.atendimento.whatsappHref

  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__stage" aria-hidden="true">
        <div className="hero-section__stage-glow" />
        <div className="hero-section__stage-texture" />
        <div className="hero-section__particles" />
      </div>

      <div className="hero-section__scene">
        <div className="hero-section__cast">
          <div className="hero-section__cast-glow" aria-hidden="true" />
          <img
            src={assetUrl(HERO_IMAGE_SRC)}
            alt={heroContent.imageAlt}
            className="hero-section__image"
            width={900}
            height={1125}
            decoding="sync"
            fetchPriority="high"
          />
        </div>

        <div className="hero-section__copy">
          <div className="hero-brand-board">
            <div className="hero-brand-board__ring">
              <img
                src={BRAND_LOGO_CIRCULAR_SRC}
                alt={heroContent.boardAlt}
                className="hero-brand-board__logo-img"
                width={512}
                height={512}
                decoding="async"
              />
            </div>
          </div>

          <h1 id="hero-title" className="hero-section__title">
            {heroContent.titleBefore}
            <em className="hero-section__title-script">{heroContent.titleHighlight}</em>
            {heroContent.titleAfter}
          </h1>

          <p className="hero-section__support">{heroContent.support}</p>

          <div className="hero-section__actions">
            <a href="#produtos" className="btn btn--primary hero-section__cta-primary">
              {heroContent.primaryCta}
              <span aria-hidden="true"> →</span>
            </a>
            <a
              href={whatsappHref}
              className="btn btn--outline hero-section__cta-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroContent.secondaryCta}
              <svg
                className="hero-section__wa-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 2.2A9.8 9.8 0 0 0 2.9 16.3L2 22l5.9-.9A9.8 9.8 0 1 0 12 2.2zm5.7 14c-.2.7-1.3 1.2-1.8 1.3-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-3.9-4.7-4.1-.2-.2-1.3-1.7-1.3-3.2s.8-2.3 1.1-2.6c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.5.1.6-.1l.8-1.1c.1-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3.1.4-.1 1.2-.3 1.8z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
