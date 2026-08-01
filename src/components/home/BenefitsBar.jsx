import {
  benefitsBar,
  benefitsTrustStrip,
} from '../../data/homeData'
import benefitsAtmosphere from '../../assets/beneficios-compra-atmosphere.png'

const BENEFIT_ICONS = {
  shield: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 6 L32 11 V20 C32 28 26 33 20 35 C14 33 8 28 8 20 V11 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 20 L18.5 23.5 L26 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  swap: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M12 14 H28 L24 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 26 H12 L16 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 14 H22 V26 H6 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M22 18 H30 L34 22 V26 H22 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="28" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="28" cy="28" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  headset: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M10 22 V18 C10 12.5 14.5 8 20 8 C25.5 8 30 12.5 30 18 V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="7" y="20" width="6" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="27" y="20" width="6" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 30 V32 C30 34 28 36 25 36 H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M12 14 L16 8 H24 L28 14 L20 32 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 14 H28" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8 L20 14 L24 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="6" y="12" width="28" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 18 H34" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 24 H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 11 V8 C8 5.8 9.8 4 12 4 C14.2 4 16 5.8 16 8 V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 13.5 L8 20 L12 17.5 L16 20 L14.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  brazil: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 5 C10 3.5 14 3.5 17 5 C19 7 20 10 19.5 13 C18.5 16.5 15.5 19 12 20 C8.5 19 5.5 16.5 4.5 13 C4 10 5 7 7 5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 11 H16 M10 14 H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
}

function LeafMark() {
  return (
    <svg className="benefits-bar__mark" viewBox="0 0 32 32" width="26" height="26" fill="none" aria-hidden="true">
      <path
        d="M16 4 C14 8 9 11 9 17 A7 7 0 0 0 16 24 A7 7 0 0 0 23 17 C23 11 18 8 16 4 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 24 V12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M11 6 C10 9 7 11 7 14.5 A4.5 4.5 0 0 0 11.5 19"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M21 6 C22 9 25 11 25 14.5 A4.5 4.5 0 0 1 20.5 19"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}

function BenefitsBar() {
  return (
    <section
      id="beneficios"
      className="benefits-bar section"
      aria-labelledby="benefits-title"
      style={{ '--benefits-atmosphere': `url(${benefitsAtmosphere})` }}
    >
      <div className="benefits-bar__atmosphere" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--light benefits-bar__head">
          <LeafMark />
          <p className="section-head__eyebrow benefits-bar__eyebrow">
            <span className="benefits-bar__eyebrow-line" aria-hidden="true" />
            Compra com confiança
            <span className="benefits-bar__eyebrow-line benefits-bar__eyebrow-line--rev" aria-hidden="true" />
          </p>
          <h2 id="benefits-title" className="section-head__title">
            Benefícios da compra
          </h2>
          <div className="benefits-bar__divider" aria-hidden="true">
            <span className="benefits-bar__divider-line" />
            <span className="benefits-bar__divider-ornament">
              <span className="benefits-bar__divider-gem" />
            </span>
            <span className="benefits-bar__divider-line benefits-bar__divider-line--rev" />
          </div>
          <p className="section-head__desc">
            Compre com confiança, receba com cuidado e vista com propósito.
          </p>
        </div>

        <div className="benefits-bar__grid">
          {benefitsBar.map((item) => (
            <article key={item.id} className="benefits-bar__item">
              <span className="benefits-bar__icon" aria-hidden="true">
                {BENEFIT_ICONS[item.icon]}
              </span>
              <div className="benefits-bar__body">
                <h3>{item.title}</h3>
                <span className="benefits-bar__item-rule" aria-hidden="true" />
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <ul className="benefits-bar__trust">
          {benefitsTrustStrip.map((item) => (
            <li key={item.id} className="benefits-bar__trust-item">
              <span className="benefits-bar__trust-icon" aria-hidden="true">
                {BENEFIT_ICONS[item.icon]}
              </span>
              <span className="benefits-bar__trust-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BenefitsBar
