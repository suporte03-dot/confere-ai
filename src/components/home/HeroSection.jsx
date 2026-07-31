import modelsImage from '../../assets/personagens-terra-estilo.webp'
import logoImage from '../../assets/logo-terra-estilo.png'
import { heroContent } from '../../data/homeData'
import HeroButtons from './HeroButtons'

function BrandHeroOrnament({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 56V14c0-3.3 2.7-6 6-6h42"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M12 56V16c0-2.2 1.8-4 4-4h40"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

function HeroSection() {
  return (
    <section id="inicio" className="brand-hero" aria-labelledby="hero-title">
      <div className="brand-hero__models">
        <div className="brand-hero__models-light" aria-hidden="true" />
        <img
          className="brand-hero__models-image"
          src={modelsImage}
          alt=""
          width={1246}
          height={1575}
          decoding="sync"
          fetchPriority="high"
        />
        <div className="brand-hero__transition" aria-hidden="true" />
        <BrandHeroOrnament className="brand-hero__ornament brand-hero__ornament--tl" />
      </div>

      <div className="brand-hero__logo">
        <img
          src={logoImage}
          alt={heroContent.boardAlt}
          width={1024}
          height={1024}
          decoding="async"
        />
      </div>

      <div className="brand-hero__content">
        <BrandHeroOrnament className="brand-hero__ornament brand-hero__ornament--br" />
        <div className="brand-hero__copy">
          <h1 id="hero-title" className="brand-hero__title">
            {heroContent.titleLead}
            <span className="brand-hero__title-accent">{heroContent.titleAccent}</span>
          </h1>

          <div className="brand-hero__rule" aria-hidden="true">
            <span className="brand-hero__rule-line" />
            <span className="brand-hero__rule-leaf">❧</span>
            <span className="brand-hero__rule-line" />
          </div>

          <div className="brand-hero__support">
            {heroContent.supportParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <HeroButtons />
        </div>
      </div>

      <span className="visually-hidden">{heroContent.imageAlt}</span>
    </section>
  )
}

export default HeroSection
