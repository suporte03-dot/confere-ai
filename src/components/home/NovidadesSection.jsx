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
            Novidades da Terra &amp; Estilo
          </h2>
          <p className="section-head__desc">
            Peças novas da temporada — escolha, vista e leve a identidade do agro com sofisticação.
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
