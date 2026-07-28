import { brandValuesHome } from '../../data/homeData'

function BrandValues() {
  return (
    <section className="brand-values section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Valores que vestimos</h2>
          <p className="section-head__desc">Pilares que guiam cada coleção Terra & Estilo.</p>
        </div>
        <div className="brand-values__grid">
          {brandValuesHome.map((item) => (
            <article key={item.title} className="brand-values__card">
              <span className="brand-values__icon" aria-hidden="true">◆</span>
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
