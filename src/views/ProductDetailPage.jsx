'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductInfoModal from '../components/ProductInfoModal'
import {
  formatCurrency,
  getColorHex,
  getInstallment,
  getProductColors,
  getProductHoverImage,
  getProductImage,
  getProductSizes,
} from '../data/mockData'
import { pathForFilter } from '../data/catalog'
import { useShop } from '../context/ShopContext'

const INFO_LINKS = [
  { id: 'sobre', label: 'Sobre o produto' },
  { id: 'provador', label: 'Provador Virtual' },
  { id: 'medidas', label: 'Tabela de Medidas' },
]

function ProductDetailPage({ product = null }) {
  const { addToCart, toggleFavorite, isFavorite, showToast } = useShop()

  const colors = useMemo(
    () => (product ? getProductColors(product, { expand: false, minCount: 0 }) : []),
    [product],
  )
  const sizes = useMemo(() => (product ? getProductSizes(product) : []), [product])
  const needsSize = sizes.length > 0
  const galleryImages = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.images) && product.images.length) {
      return product.images.map((img) => img.url).filter(Boolean)
    }
    const primary = getProductImage(product)
    const hover = getProductHoverImage(product)
    return [primary, hover].filter(Boolean)
  }, [product])

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoTab, setInfoTab] = useState('sobre')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setSelectedColor(null)
    setSelectedSize(null)
    setActiveImageIndex(0)
    setInfoOpen(false)
  }, [product?.id])

  const resolvedColor = selectedColor && colors.includes(selectedColor)
    ? selectedColor
    : colors[0] || null
  const favorite = product ? isFavorite(product.id) : false
  const displayImage = galleryImages[activeImageIndex] || (product ? getProductImage(product) : '')

  const selectedVariant = useMemo(() => {
    if (!product || !Array.isArray(product.variants) || !product.variants.length) return null
    return (
      product.variants.find((v) => {
        const sizeOk = !needsSize || !selectedSize || v.size === selectedSize
        const colorOk = !resolvedColor || !v.color || v.color === resolvedColor
        return sizeOk && colorOk
      }) || null
    )
  }, [product, needsSize, selectedSize, resolvedColor])

  const isAvailable = Boolean(
    product &&
      (product.available === true ||
        (product.available !== false &&
          typeof product.stock === 'number' &&
          product.stock > 0)),
  )
  const selectedSku = selectedVariant?.sku || product?.sku || null

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="container product-detail-page__empty">
          <p className="product-detail-page__eyebrow">Terra & Estilo</p>
          <h1>Produto não encontrado</h1>
          <p>A peça que você procura pode ter saído de linha ou o link está incorreto.</p>
          <Link href="/" className="btn btn--gold">
            Voltar ao início
          </Link>
        </div>
      </main>
    )
  }

  const handleAdd = () => {
    if (!isAvailable) {
      showToast('Produto indisponível.')
      return
    }
    if (needsSize && !selectedSize) {
      showToast('Selecione um tamanho para adicionar ao carrinho.')
      return
    }
    addToCart(
      { ...product, selectedSize, selectedColor: resolvedColor },
      {
        size: selectedSize,
        color: resolvedColor,
        requireSize: needsSize,
        variantId: selectedVariant?.id || null,
      },
    )
  }

  const openInfo = (tab) => {
    setInfoTab(tab)
    setInfoOpen(true)
  }

  const categoryHref = pathForFilter(product.department || product.category || 'Todos')
  const thumbs = galleryImages.length >= 2 ? galleryImages.slice(0, 6) : galleryImages

  return (
    <main className="product-detail-page">
      <div className="container product-detail-page__body">
        <nav className="catalog-breadcrumb" aria-label="Navegação">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href={categoryHref}>{product.department || product.categoryName || 'Catálogo'}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-detail__gallery">
            <div className="product-detail__stage">
              <Image
                src={displayImage}
                alt={`${product.name}${resolvedColor ? ` — ${resolvedColor}` : ''}`}
                className="product-detail__img"
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                priority
              />
              {product.badge && (
                <span className="product-detail__badge">{product.badge}</span>
              )}
            </div>
            {thumbs.length > 0 && (
              <div className="product-detail__thumbs" role="group" aria-label="Imagens do produto">
                {thumbs.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    className={`product-detail__thumb${activeImageIndex === index ? ' is-active' : ''}`}
                    aria-pressed={activeImageIndex === index}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image src={src} alt="" width={96} height={120} sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <p className="product-detail__eyebrow">
              {[product.department || product.categoryName, product.subcategory || product.collectionName]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__desc">
              {product.description ||
                'Peça Terra & Estilo com acabamento premium e identidade do Sul.'}
            </p>

            <div className="product-detail__pricing">
              {product.oldPrice && (
                <span className="product-detail__old-price">
                  {formatCurrency(product.oldPrice)}
                </span>
              )}
              <p className="product-detail__price">{formatCurrency(product.price)}</p>
            </div>
            <p className="product-detail__installments">
              ou {getInstallment(product.price, product.installments || 5)}
            </p>

            {colors.length > 0 && (
              <div className="product-detail__colors">
                <div className="product-detail__label-row">
                  <span className="product-detail__label">Cor</span>
                  <span className="product-detail__value">{resolvedColor}</span>
                </div>
                <div className="product-detail__swatches" role="listbox" aria-label="Opções de cor">
                  {colors.map((color) => {
                    const selected = resolvedColor === color
                    return (
                      <button
                        key={color}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={`product-detail__swatch${selected ? ' is-selected' : ''}`}
                        title={color}
                        onClick={() => setSelectedColor(color)}
                      >
                        <span
                          className="product-detail__swatch-chip"
                          style={{ backgroundColor: getColorHex(color) }}
                          aria-hidden="true"
                        />
                        <span className="product-detail__swatch-name">{color}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {needsSize && (
              <div className="product-detail__sizes">
                <div className="product-detail__label-row">
                  <span className="product-detail__label">Tamanho</span>
                  <span className="product-detail__value">
                    {selectedSize || 'Selecione'}
                  </span>
                </div>
                <div className="product-detail__size-list" role="group" aria-label="Tamanhos">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`product-detail__size${selectedSize === size ? ' is-selected' : ''}`}
                      aria-pressed={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="product-detail__stock">
              {isAvailable && typeof product.stock === 'number'
                ? `${product.stock} em estoque`
                : 'Indisponível'}
            </p>
            {selectedSku ? (
              <p className="product-detail__sku">SKU: {selectedSku}</p>
            ) : null}

            <div className="product-detail__actions">
              <button
                type="button"
                className="btn btn--primary product-detail__cta"
                onClick={handleAdd}
                disabled={!isAvailable}
              >
                {isAvailable ? 'Adicionar ao carrinho' : 'Indisponível'}
              </button>
              <button
                type="button"
                className={`product-detail__fav${favorite ? ' is-active' : ''}`}
                aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                onClick={() => toggleFavorite(product.id)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'}>
                  <path
                    d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>

            <nav className="product-detail__info-links" aria-label="Mais informações">
              {INFO_LINKS.map((link, index) => (
                <span key={link.id} className="product-detail__info-item">
                  {index > 0 && (
                    <span className="product-detail__info-sep" aria-hidden="true">
                      |
                    </span>
                  )}
                  <button
                    type="button"
                    className="product-detail__info-link"
                    onClick={() => openInfo(link.id)}
                  >
                    {link.label}
                  </button>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <ProductInfoModal
        product={product}
        open={infoOpen}
        initialTab={infoTab}
        onClose={() => setInfoOpen(false)}
        onSelectSize={(size) => {
          setSelectedSize(size)
          setInfoOpen(false)
          showToast(`Tamanho ${size} selecionado.`)
        }}
      />
    </main>
  )
}

export default ProductDetailPage
