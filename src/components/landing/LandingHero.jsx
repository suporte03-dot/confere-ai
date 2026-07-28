import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

const VALUES = [
  'RAÍZES',
  'IDENTIDADE',
  'SOFISTICAÇÃO',
  'SUL DO BRASIL',
  'AUTENTICIDADE',
]

function LandingHero() {
  return (
    <section id="inicio" className="lp-hero">
      <div className="lp-hero__leaf lp-hero__leaf--left" aria-hidden="true" />
      <div className="lp-hero__fabric lp-hero__fabric--right" aria-hidden="true" />

      <div className="lp-container lp-hero__grid">
        <aside className="lp-hero__values" aria-label="Valores da marca">
          {VALUES.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </aside>

        <div className="lp-hero__center">
          <img
            src={BRAND_LOGO_CIRCULAR_SRC}
            alt="Terra & Estilo — A marca do agro brasileiro"
            className="lp-hero__logo"
            width={1024}
            height={1024}
          />
        </div>

        <aside className="lp-hero__seal" aria-label="Selo Terra & Estilo">
          <div className="lp-hero__seal-ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="seal-text" d="M 60,18 A 42,42 0 1,1 59.9,18" fill="none" />
              </defs>
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1" />
              <text fill="currentColor" fontSize="7.5" letterSpacing="2.8">
                <textPath href="#seal-text" startOffset="50%" textAnchor="middle">
                  SUL DO BRASIL • ESTILO COM PROPÓSITO
                </textPath>
              </text>
              <circle cx="60" cy="60" r="22" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            </svg>
            <span className="lp-hero__seal-mark">TE</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default LandingHero
