import {
  formatCurrency,
  getInstallment,
  getColorHex,
  getProductImage,
  getProductHoverImage,
  getProductSizes,
  getProductRating,
} from '../data/mockData'
import { useShop } from '../context/ShopContext'

function ProductCard({
  product,
  tone = 'light',
  variant,
  showSizes = true,
  showRating = false,
}) {
  const { addToCart, toggleFavorite, isFavorite, showToast } = useShop()
  const favorite = isFavorite(product.id)
  const primaryImage = getProductImage(product)
  const hoverImage = getProductHoverImage(product)
  const sizes = getProductSizes(product)
  const rating = getProductRating(product)
  const badge = product.badge
  const isNovo = badge && /novo|novidade/i.test(badge)

  const badgeClass = badge
    ? `product-card__badge--${badge.replace(/\s/g, '-').toLowerCase()}`
    : ''

  const handleCardActivate = () => {
    addToCart(product)
  }

  const stop = (event) => {
    event.stopPropagation()
  }

  const variantClass = variant ? ` product-card--${variant}` : ''

  return (
    <article
      className={`product-card product-card--${tone}${variantClass} product-card--clickable`}
      role="link"
      tabIndex={0}
      aria-label={`${product.name} — Comprar agora`}
      onClick={handleCardActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleCardActivate()
        }
      }}
    >
      <div className="product-card__media">
        <div className="product-card__image">
          <img
            src={primaryImage}
            alt={product.name}
            className="product-card__img product-card__img--primary"
            loading="lazy"
            decoding="async"
          />
          <img
            src={hoverImage}
            alt=""
            className="product-card__img product-card__img--hover"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        </div>

        {isNovo && <span className="product-card__badge product-card__badge--novo">NOVO</span>}
        {badge && !isNovo && (
          <span className={`product-card__badge ${badgeClass}`}>{badge}</span>
        )}

        <button
          type="button"
          className={`product-card__fav ${favorite ? 'product-card__fav--active' : ''}`}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={(event) => {
            stop(event)
            toggleFavorite(product.id)
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'}>
            <path
              d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        <button
          type="button"
          className="product-card__quick"
          onClick={(event) => {
            stop(event)
            showToast(`Visualização rápida: ${product.name}`)
          }}
        >
          Visualização rápida
        </button>

        {showSizes && sizes.length > 0 && (
          <div className="product-card__sizes" aria-label="Tamanhos disponíveis">
            {sizes.slice(0, 5).map((size) => (
              <button
                key={size}
                type="button"
                className="product-card__size"
                onClick={(event) => {
                  stop(event)
                  addToCart({ ...product, selectedSize: size })
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__cat">
          {product.department} · {product.subcategory}
        </p>
        <h3 className="product-card__name">{product.name}</h3>

        {showRating && (
          <p className="product-card__rating" aria-label={`Avaliação ${rating} de 5`}>
            <span aria-hidden="true">★</span> {rating.toFixed(1)}
          </p>
        )}

        <div className="product-card__colors">
          {(product.colors || []).map((color) => (
            <span
              key={color}
              style={{ backgroundColor: getColorHex(color) }}
              title={color}
            />
          ))}
        </div>

        <div className="product-card__pricing">
          {product.oldPrice && (
            <span className="product-card__old-price">{formatCurrency(product.oldPrice)}</span>
          )}
          <p className="product-card__price">{formatCurrency(product.price)}</p>
        </div>
        <p className="product-card__installments">ou {getInstallment(product.price)}</p>
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={(event) => {
            stop(event)
            addToCart(product)
          }}
        >
          Comprar agora
        </button>
      </div>
    </article>
  )
}

export default ProductCard
