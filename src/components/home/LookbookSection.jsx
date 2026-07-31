import { lookbookHome } from '../../data/homeData'
import { products, formatCurrency, getProductImage } from '../../data/mockData'
import { useShop } from '../../context/ShopContext'

function LookbookSection() {
  const { addToCart, navigateToCollection } = useShop()
  const { eyebrow, title, description, primaryImage, collage, hotspots } = lookbookHome

  const resolveProduct = (id) => products.find((p) => p.id === id)

  return (
    <section id="lookbook" className="lookbook-section section" aria-labelledby="lookbook-title">
      <div className="container">
        <div className="section-head">
          <p className="section-head__eyebrow">{eyebrow}</p>
          <h2 id="lookbook-title" className="section-head__title">
            {title}
          </h2>
          <p className="section-head__desc">{description}</p>
        </div>

        <div className="lookbook-section__layout">
          <div className="lookbook-section__hero">
            <img
              src={primaryImage}
              alt="Editorial Terra & Estilo — vista o estilo"
              className="lookbook-section__hero-img"
              loading="lazy"
              decoding="async"
            />
            {hotspots.map((spot) => {
              const product = resolveProduct(spot.productId)
              if (!product) return null
              return (
                <button
                  key={spot.id}
                  type="button"
                  className="lookbook-section__hotspot"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  aria-label={`${spot.label} — ${formatCurrency(product.price)}`}
                  onClick={() => addToCart(product)}
                >
                  <span className="lookbook-section__hotspot-dot" />
                  <span className="lookbook-section__hotspot-card">
                    <strong>{spot.label}</strong>
                    <em>{formatCurrency(product.price)}</em>
                    <span>Comprar</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="lookbook-section__collage">
            {collage.map((item) => {
              const product = resolveProduct(item.productId)
              const src = product ? getProductImage(product) : item.src
              return (
                <button
                  key={item.alt}
                  type="button"
                  className="lookbook-section__tile"
                  onClick={() => {
                    if (product) addToCart(product)
                    else navigateToCollection('Todos')
                  }}
                >
                  <img src={src} alt={item.alt} loading="lazy" decoding="async" />
                  {product && (
                    <span className="lookbook-section__tile-meta">
                      {product.name}
                      <strong>{formatCurrency(product.price)}</strong>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LookbookSection
