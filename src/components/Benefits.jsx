import { storeBenefits } from '../data/mockData'

function Benefits() {
  return (
    <section className="section benefits">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Benefícios Terra & Estilo</h2>
          <p className="section-head__desc">Comprar conosco é simples, seguro e acolhedor.</p>
        </div>
        <div className="benefits__grid">
          {storeBenefits.map((item) => (
            <article key={item.id} className="benefit-card">
              <div className="benefit-card__icon" aria-hidden="true">◆</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
