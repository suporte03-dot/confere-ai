import { benefitsBar } from '../../data/homeData'

function BenefitsBar() {
  return (
    <section className="benefits-bar section">
      <div className="container">
        <div className="section-head section-head--light">
          <h2 className="section-head__title">Experiência Terra & Estilo</h2>
          <p className="section-head__desc">
            Compre com confiança, receba com cuidado e vista com propósito.
          </p>
        </div>
        <div className="benefits-bar__grid">
          {benefitsBar.map((item) => (
            <article key={item.id} className="benefits-bar__item">
              <span className="benefits-bar__icon" aria-hidden="true">◆</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsBar
