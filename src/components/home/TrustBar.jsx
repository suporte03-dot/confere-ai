import { benefitsBar } from '../../data/homeData'

const TRUST_ICONS = {
  shield: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 6 L32 11 V20 C32 28 26 33 20 35 C14 33 8 28 8 20 V11 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M15 20 L18.5 23.5 L26 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  swap: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M12 14 H28 L24 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 26 H12 L16 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 14 H22 V26 H6 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M22 18 H30 L34 22 V26 H22 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="28" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="28" cy="28" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 30 S8 22 8 15 C8 11 11 8 15 8 C18 8 20 10 20 10 C20 10 22 8 25 8 C29 8 32 11 32 15 C32 22 20 30 20 30 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="6" y="12" width="28" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 18 H34" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 24 H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
}

function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Benefícios Terra & Estilo">
      <div className="container trust-bar__inner">
        <ul className="trust-bar__list">
          {benefitsBar.map((item) => (
            <li key={item.id} className="trust-bar__item">
              <span className="trust-bar__icon" aria-hidden="true">
                {TRUST_ICONS[item.icon]}
              </span>
              <strong className="trust-bar__label">{item.title}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default TrustBar
