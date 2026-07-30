import { brandValuesHome } from '../../data/homeData'

const VALUE_ICONS = {
  raizes: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 8 V22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M24 22 C16 28 12 34 10 40 M24 22 C32 28 36 34 38 40 M24 22 C20 30 22 36 24 42 C26 36 28 30 24 22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  identidade: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M24 10 V14 M24 34 V38 M10 24 H14 M34 24 H38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  sofisticacao: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 8 L28 20 H40 L30 28 L34 40 L24 32 L14 40 L18 28 L8 20 H20 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sul: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M14 12 C18 10 22 14 24 18 C26 14 30 10 34 12 C36 20 32 28 24 38 C16 28 12 20 14 12 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 18 V30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  autenticidade: (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 10 C18 16 14 22 14 28 C14 34 18 38 24 38 C30 38 34 34 34 28 C34 22 30 16 24 10 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 22 V32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
}

function BrandValues() {
  return (
    <section className="brand-values section" aria-labelledby="brand-values-title">
      <div className="container">
        <div className="section-head">
          <h2 id="brand-values-title" className="section-head__title">
            Valores que vestimos
          </h2>
          <p className="section-head__desc">Pilares que guiam cada coleção Terra &amp; Estilo.</p>
        </div>
        <div className="brand-values__grid">
          {brandValuesHome.map((item) => (
            <article key={item.title} className="brand-values__card">
              <span className="brand-values__icon" aria-hidden="true">
                {VALUE_ICONS[item.icon]}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandValues
