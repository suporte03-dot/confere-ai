import { aboutBrand, BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

function BotanicalAccent({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 120" fill="none" aria-hidden="true">
      <path
        d="M40 112 C40 72 22 58 18 28 C34 42 40 58 40 112 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M40 112 C40 72 58 58 62 28 C46 42 40 58 40 112 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M40 112 V18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M40 48 C28 42 22 30 20 18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M40 62 C52 56 58 44 60 32"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AboutBrand() {
  return (
    <section id="sobre" className="about-brand section" aria-labelledby="about-brand-title">
      <div className="container">
        <div className="about-brand__panel">
          <div className="about-brand__content">
            <span className="about-brand__eyebrow">{aboutBrand.eyebrow}</span>
            <h2 id="about-brand-title" className="about-brand__title">
              {aboutBrand.title}
            </h2>
            <p className="about-brand__text">{aboutBrand.text}</p>
            <a href="#contato" className="btn btn--gold">
              {aboutBrand.cta}
            </a>
          </div>

          <div className="about-brand__visual">
            <BotanicalAccent className="about-brand__botanical about-brand__botanical--left" />
            <div className="about-brand__logo-wrap">
              <span className="about-brand__halo" aria-hidden="true" />
              <img
                src={BRAND_LOGO_CIRCULAR_SRC}
                alt="Logo circular Terra & Estilo"
                className="about-brand__img"
                width={360}
                height={360}
                loading="lazy"
                decoding="async"
              />
            </div>
            <BotanicalAccent className="about-brand__botanical about-brand__botanical--right" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutBrand
