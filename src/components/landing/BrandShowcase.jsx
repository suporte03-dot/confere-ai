const MOCKUPS = [
  {
    title: 'Etiqueta da marca',
    desc: 'Acabamento premium em verde floresta com detalhes dourados.',
    image: '/images/brand/mockup-tag.png',
  },
  {
    title: 'Papelaria & cartão',
    desc: 'Textura creme e tipografia serifada para comunicação editorial.',
    image: '/images/brand/mockup-stationery.png',
  },
  {
    title: 'Ícone monograma TE',
    desc: 'Versão simplificada para favicon, app e aplicações digitais.',
    image: '/images/brand/mockup-icon.png',
  },
]

function BrandShowcase() {
  return (
    <section id="colecoes" className="lp-showcase">
      <div className="lp-container">
        <header className="lp-section-head">
          <p className="lp-eyebrow">Identidade visual</p>
          <h2>A essência TerraEstilo em cada detalhe</h2>
          <p>
            Uma linguagem visual coesa que traduz origem, elegância e autenticidade
            em peças físicas e digitais.
          </p>
        </header>

        <div className="lp-showcase__grid">
          {MOCKUPS.map((item) => (
            <article key={item.title} className="lp-showcase__card">
              <div className="lp-showcase__media">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="lp-showcase__copy">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandShowcase
