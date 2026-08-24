'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import ProductInfoModal from './ProductInfoModal'

const INFO_LINKS = [
  { id: 'sobre', label: 'Sobre o produto', shortLabel: 'Sobre' },
  { id: 'provador', label: 'Provador Virtual', shortLabel: 'Provador' },
  { id: 'medidas', label: 'Tabela de Medidas', shortLabel: 'Medidas' },
]

function ProductCard({
  product,
  tone = 'light',
  variant,
  showSizes = true,
  showRating = false,
}) {
  const router = useRouter()
  const { addToCart, toggleFavorite, isFavorite, showToast } = useShop()
  const [selectedSize, setSelectedSize] = useState(null)
  const [pickingSize, setPickingSize] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoTab, setInfoTab] = useState('sobre')
  const favorite = isFavorite(product.id)
  const primaryImage = getProductImage(product)
  const hoverImage = getProductHoverImage(product)
  const sizes = getProductSizes(product)
  const rating = getProductRating(product)
  const badge = product.badge
  const isNovo = product.new || (badge && /novo|novidade/i.test(badge))
  const needsSize = showSizes && sizes.length > 0
  const detailPath = `/produto/${product.slug || product.id}`
  const isAvailable =
    product.available === true ||
    (product.available !== false &&
      (typeof product.stock !== 'number' || product.stock > 0))

  const badgeClass = badge
    ? `product-card__badge--${badge.replace(/\s/g, '-').toLowerCase()}`
    : ''

  const stop = (event) => {
    event.stopPropagation()
  }

  const openInfo = (event, tab) => {
    stop(event)
    setInfoTab(tab)
    setInfoOpen(true)
  }

  const goToDetail = (event) => {
    if (event.target.closest('button, a, input, select, textarea, label')) return
    router.push(detailPath)
  }

  const onCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      router.push(detailPath)
    }
  }

  const tryAdd = (sizeOverride) => {
    if (!isAvailable) {
      showToast('Produto indisponível.')
      return false
    }
    const size = sizeOverride ?? selectedSize
    if (needsSize && !size) {
      setPickingSize(true)
      showToast('Selecione um tamanho para adicionar ao carrinho.')
      return false
    }
    setPickingSize(false)
    return addToCart({ ...product, selectedSize: size }, { size, requireSize: needsSize })
  }

  const handleAddToCart = (event) => {
    stop(event)
    tryAdd()
  }

  const handleSizePick = (event, size) => {
    stop(event)
    if (!isAvailable) {
      showToast('Produto indisponível.')
      return
    }
    setSelectedSize(size)
    setPickingSize(false)
    addToCart({ ...product, selectedSize: size }, { size, requireSize: true })
  }

  const variantClass = variant ? ` product-card--${variant}` : ''
  const pickingClass = pickingSize ? ' is-picking-size' : ''

  return (
    <article
      className={`product-card product-card--${tone} product-card--clickable${variantClass}${pickingClass}`}
      aria-label={`${product.name}. Abrir detalhes do produto`}
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={onCardKeyDown}
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
          onClick={handleAddToCart}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Adicionar' : 'Indisponível'}
        </button>

        {showSizes && sizes.length > 0 && (
          <div className="product-card__sizes" aria-label="Selecionar tamanho" role="group">
            {sizes.slice(0, 5).map((size) => (
              <button
                key={size}
                type="button"
                className={`product-card__size${selectedSize === size ? ' is-selected' : ''}`}
                aria-pressed={selectedSize === size}
                onClick={(event) => handleSizePick(event, size)}
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
        <Link href={detailPath} className="product-card__name-link" onClick={stop}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

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
        <p className="product-card__installments">
          ou {getInstallment(product.price, product.installments || 10)}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--block product-card__cta"
          onClick={handleAddToCart}
          aria-expanded={needsSize ? pickingSize : undefined}
        >
          <span className="product-card__cta-label product-card__cta-label--full">
            Adicionar ao carrinho
          </span>
          <span className="product-card__cta-label product-card__cta-label--short">
            Adicionar
          </span>
        </button>

        <nav className="product-card__info" aria-label="Mais informações do produto">
          {INFO_LINKS.map((link, index) => (
            <span key={link.id} className="product-card__info-item">
              {index > 0 && <span className="product-card__info-sep" aria-hidden="true">|</span>}
              <button
                type="button"
                className="product-card__info-link"
                onClick={(event) => openInfo(event, link.id)}
                aria-label={link.label}
              >
                <span className="product-card__info-label product-card__info-label--full">
                  {link.label}
                </span>
                <span className="product-card__info-label product-card__info-label--short">
                  {link.shortLabel}
                </span>
              </button>
            </span>
          ))}
        </nav>
      </div>

      <ProductInfoModal
        product={product}
        open={infoOpen}
        initialTab={infoTab}
        onClose={() => setInfoOpen(false)}
        onSelectSize={(size) => {
          setSelectedSize(size)
          setPickingSize(false)
          setInfoOpen(false)
          showToast(`Tamanho ${size} selecionado. Toque em Adicionar para concluir.`)
        }}
      />
    </article>
  )
}

export default ProductCard
