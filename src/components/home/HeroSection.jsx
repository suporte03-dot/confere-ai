import { heroContent, BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'
import HeroButtons from './HeroButtons'
import DecorativeBottomBand from './DecorativeBottomBand'

const HERO_ASSET_V = '20260730k'
const HERO_IMAGE_SRC = `/images/hero/couple-hero.png?v=${HERO_ASSET_V}`

function HeroSection() {
  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-section__atmosphere" aria-hidden="true">
        <div className="hero-section__wash" />
        <div className="hero-section__glow" />
        <div className="hero-section__veil" />
        <div className="hero-section__dust" />
      </div>

      <div className="hero-layout">
        <div className="hero-zone hero-zone--left">
          <div className="hero-models">
            <span className="hero-models__lift" aria-hidden="true" />
            <img
              src={assetUrl(HERO_IMAGE_SRC)}
              alt=""
              className="hero-models__img"
              width={1324}
              height={1575}
              decoding="sync"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="hero-zone hero-zone--center">
          <div className="hero-logo-wrap">
            <span className="hero-logo-glow" aria-hidden="true" />
            <img
              src={BRAND_LOGO_CIRCULAR_SRC}
              alt={heroContent.boardAlt}
              className="hero-logo"
              width={512}
              height={512}
              decoding="async"
            />
          </div>
        </div>

        <div className="hero-zone hero-zone--right">
          <div className="hero-content">
            <h1 id="hero-title" className="hero-title">
              {heroContent.titleLead}
              <span className="hero-title__accent">{heroContent.titleAccent}</span>
            </h1>

            <div className="hero-section__rule" aria-hidden="true">
              <span className="hero-section__rule-line" />
              <span className="hero-section__rule-leaf">❧</span>
              <span className="hero-section__rule-line" />
            </div>

            <div className="hero-section__support">
              {heroContent.supportParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <HeroButtons />
          </div>
        </div>
      </div>

      <DecorativeBottomBand />

      <span className="visually-hidden">{heroContent.imageAlt}</span>
    </section>
  )
}

export default HeroSection
