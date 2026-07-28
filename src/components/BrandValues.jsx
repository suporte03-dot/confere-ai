import { brandValues } from '../data/mockData'

function BrandValues() {
  return (
    <section className="section brand-values">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Valores que vestimos</h2>
          <p className="section-head__desc">
            Pilares que guiam cada coleção Terra & Estilo.
          </p>
        </div>
        <div className="brand-values__grid">
          {brandValues.map((item) => (
            <article key={item.title} className="brand-values__card">
              <span className="brand-values__mark" aria-hidden="true">◆</span>
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
