import { trustBadges } from '../../data/homeData'

const ICONS = {
  diamond: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 4.5 10.5 12 21l7.5-10.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M4.5 10.5h15M9 3.8l-4.5 6.7L12 21M15 3.8l4.5 6.7L12 21" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6v5.5c0 4.2 2.8 7.8 7 9 4.2-1.2 7-4.8 7-9V6l-7-3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  return: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h10a3 3 0 0 1 3 3v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M7 7 4.5 9.5 7 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="14" width="10" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  headset: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 13v-1a8 8 0 0 1 16 0v1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6H4zm16 0h-2v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 19v1a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
}

function TrustBadges() {
  return (
    <section className="trust-badges" aria-label="Benefícios da loja">
      <div className="trust-badges__inner">
        {trustBadges.map((item) => (
          <article key={item.id} className="trust-badges__item">
            <span className="trust-badges__icon">{ICONS[item.icon]}</span>
            <div className="trust-badges__copy">
              <h3 className="trust-badges__title">{item.title}</h3>
              <p className="trust-badges__desc">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TrustBadges
