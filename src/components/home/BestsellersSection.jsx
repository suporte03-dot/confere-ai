import { useMemo, useState } from 'react'
import { bestsellersTabs, bestsellersSection } from '../../data/homeData'
import { products, getBestsellersProducts } from '../../data/mockData'
import { useShop } from '../../context/ShopContext'
import ProductCard from '../ProductCard'

function BestsellersSection() {
  const {
    filteredProducts,
    categoryFilter,
    isSearchActive,
    activeFilterLabel,
    clearSearch,
    setCategoryFilter,
  } = useShop()

  const [tab, setTab] = useState('Todos')

  const showSearchResults = isSearchActive || categoryFilter !== 'Todos'

  const items = useMemo(() => {
    if (showSearchResults) return filteredProducts
    return getBestsellersProducts(products, tab, 8)
  }, [filteredProducts, showSearchResults, tab])

  const handleTab = (next) => {
    setTab(next)
    setCategoryFilter('Todos')
    if (isSearchActive) clearSearch()
  }

  return (
    <section
      id="favoritos"
      className="bestsellers-section section"
      aria-labelledby="bestsellers-title"
    >
      <div id="mais-vendidos" className="visually-hidden" aria-hidden="true" />
      <div id="produtos" className="visually-hidden" aria-hidden="true" />
      <div className="container">
        <div className="section-head section-head--light bestsellers-section__head">
          <p className="section-head__eyebrow">{bestsellersSection.eyebrow}</p>
          <h2 id="bestsellers-title" className="section-head__title">
            {isSearchActive ? bestsellersSection.searchTitle : bestsellersSection.title}
          </h2>
          <span className="bestsellers-section__rule" aria-hidden="true" />
          <p className="section-head__desc">
            {isSearchActive
              ? `Exibindo resultados para ${activeFilterLabel}.`
              : bestsellersSection.description}
          </p>
        </div>

        {!showSearchResults && (
          <div
            className="bestsellers-section__tabs"
            role="tablist"
            aria-label={bestsellersSection.tabsLabel}
          >
            {bestsellersTabs.map((label) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={tab === label}
                className={`bestsellers-section__tab${tab === label ? ' is-active' : ''}`}
                onClick={() => handleTab(label)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {showSearchResults && filteredProducts.length === 0 ? (
          <div className="product-grid-section__empty" role="status">
            <p>Nenhum resultado encontrado para sua busca.</p>
            <button type="button" className="btn btn--outline product-grid-section__clear" onClick={clearSearch}>
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="products-grid products-grid--bestsellers">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                tone="dark"
                variant="vitrine"
                showSizes
                showRating={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default BestsellersSection
