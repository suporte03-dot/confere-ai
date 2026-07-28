import { homeFeaturedProducts } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'
import ProductCard from '../ProductCard'

function ProductGrid() {
  const {
    filteredProducts,
    categoryFilter,
    isSearchActive,
    searchQuery,
    activeFilterLabel,
    clearSearch,
  } = useShop()

  const hasFilter = categoryFilter !== 'Todos' || isSearchActive
  const products = hasFilter ? filteredProducts : homeFeaturedProducts
  const showEmptyState = hasFilter && products.length === 0

  return (
    <section id="produtos" className="product-grid-section section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">
            {isSearchActive ? 'Resultados da busca' : 'Destaques da coleção'}
          </h2>
          <p className="section-head__desc">
            {isSearchActive
              ? `Exibindo resultados para ${activeFilterLabel}.`
              : 'Peças selecionadas com acabamento refinado e identidade Terra & Estilo.'}
          </p>
        </div>

        {showEmptyState ? (
          <div className="product-grid-section__empty" role="status">
            <p>Nenhum resultado encontrado para sua busca.</p>
            {isSearchActive && (
              <button type="button" className="btn btn--outline product-grid-section__clear" onClick={clearSearch}>
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
