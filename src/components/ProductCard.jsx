import { formatCurrency, getInstallment, getColorHex, getProductImage } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function ProductCard({ product }) {
  const { addToCart, toggleFavorite, isFavorite, showToast } = useShop()
  const favorite = isFavorite(product.id)

  return (
    <article className="product-card">
      <div className="product-card__media">
        <VisualMedia
          src={getProductImage(product)}
          alt={product.name}
          label={product.subcategory}
          variant={product.variant}
          className="product-card__image"
          imgClassName="product-card__img"
        />
        {product.badge && (
          <span className={`product-card__badge product-card__badge--${product.badge.replace(/\s/g, '-').toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        <button
          type="button"
          className={`product-card__fav ${favorite ? 'product-card__fav--active' : ''}`}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={() => toggleFavorite(product.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'}>
            <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
        <button
          type="button"
          className="product-card__quick"
          onClick={() => showToast(`Visualização rápida: ${product.name}`)}
        >
          Visualização rápida
        </button>
      </div>

      <div className="product-card__body">
        <p className="product-card__cat">{product.category} · {product.subcategory}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__colors">
          {product.colors.map((color) => (
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
        <button type="button" className="btn btn--primary btn--block" onClick={() => addToCart(product)}>
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  )
}

export default ProductCard
