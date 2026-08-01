import { products, getNovidadesProducts } from '../../data/mockData'
import ProductCard from '../ProductCard'

function NovidadesSection() {
  const items = getNovidadesProducts(products, 8)

  if (!items.length) return null

  return (
    <section id="novidades" className="novidades-section section" aria-labelledby="novidades-title">
      <div className="container">
        <div className="section-head">
          <p className="section-head__eyebrow">Acabou de chegar</p>
          <h2 id="novidades-title" className="section-head__title">
            Novidades
          </h2>
          <p className="section-head__desc">
            Lançamentos da temporada Terra &amp; Estilo — peças novas para vestir a identidade do agro com sofisticação.
          </p>
        </div>

        <div className="products-grid products-grid--novidades">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} tone="light" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NovidadesSection
