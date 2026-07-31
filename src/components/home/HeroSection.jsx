import modelsImage from '../../assets/personagens-terra-estilo.webp'
import logoImage from '../../assets/logo-terra-estilo.png'
import { heroContent } from '../../data/homeData'
import HeroButtons from './HeroButtons'

/** Thin gold corner frame — top-left of models panel (matches ref ornament). */
function BrandHeroCorner({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 62V16c0-3.3 2.7-6 6-6h46"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M14 62V18c0-2.2 1.8-4 4-4h44"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M52 8c2.2 1.4 3.6 3.4 4.2 5.6 1.8-1.6 4.4-2.2 6.8-1.4-1.6 2.4-1.8 5.2-.6 7.6-2.4-.4-4.8.6-6.4 2.6-.6-2.4-2.2-4.4-4.4-5.4 1.4-1.8 1.8-4.2.4-6.4z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  )
}

/** Soft botanical wash — bottom-right of ivory panel (faint, as in ref). */
function BrandHeroBotanical({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M198 168c-28-18-48-46-54-78 18 8 34 24 46 44 6-22 4-46-8-66 22 14 38 38 44 66-16-4-28 6-28 34z"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.55"
      />
      <path
        d="M132 156c-18-30-22-62-12-90 8 16 22 30 40 38-14-28-12-56 4-80 10 24 28 44 50 56-26 2-46 18-54 42-10 12-18 26-28 34z"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.4"
      />
      <path
        d="M168 42c8 14 10 30 6 46"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}

function HeroSection() {
  return (
    <section id="inicio" className="brand-hero" aria-labelledby="hero-title">
      {/* Layer 1–3: cast photo + dark/gold atmosphere + soft seam into ivory */}
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
        <BrandHeroCorner className="brand-hero__ornament brand-hero__ornament--tl" />
      </div>

      {/* Layer 4: circular logo on the seam (above ivory, clear of faces/title) */}
      <div className="brand-hero__logo">
        <img
          src={logoImage}
          alt={heroContent.boardAlt}
          width={1024}
          height={1024}
          decoding="async"
        />
      </div>

      {/* Layers 5–6: ivory text panel + real DOM title / copy / CTAs */}
      <div className="brand-hero__content">
        <BrandHeroBotanical className="brand-hero__ornament brand-hero__ornament--br" />
        <div className="brand-hero__copy">
          <h1 id="hero-title" className="brand-hero__title">
            {(heroContent.titleLines ?? ['A essência e a', 'elegância do']).map((line) => (
              <span key={line} className="brand-hero__title-line">
                {line}
              </span>
            ))}
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
