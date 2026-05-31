import { storeBenefits } from '../data/mockData'

function Benefits() {
  return (
    <section className="section benefits">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Comprar na TerraBrasil é simples e seguro</h2>
        </div>
        <div className="benefits__grid">
          {storeBenefits.map((item) => (
            <article key={item.title} className="benefit-card">
              <div className="benefit-card__icon" aria-hidden="true">✦</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
