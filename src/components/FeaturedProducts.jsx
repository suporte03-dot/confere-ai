import { featuredProducts, filterOptions } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import ProductCard from './ProductCard'

function FeaturedProducts() {
  const {
    filteredProducts,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    activeFilterLabel,
  } = useShop()

  const showFeatured = categoryFilter === 'Todos' && !searchQuery.trim()
  const products = showFeatured ? featuredProducts : filteredProducts
  const title = showFeatured ? 'Destaques da coleção' : activeFilterLabel

  const emptyMessage = searchQuery.trim()
    ? 'Nenhum produto encontrado para sua busca.'
    : 'Nenhum produto encontrado nesta categoria.'

  return (
    <section id="produtos" className="section products-section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">{title}</h2>
          <p className="section-head__desc">
            Peças selecionadas com acabamento refinado e identidade TerraEstilo.
          </p>
        </div>

        <div className="products-toolbar">
          <div className="filter-pills" role="group" aria-label="Filtrar produtos">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-pill ${categoryFilter === option ? 'filter-pill--active' : ''}`}
                onClick={() => setCategoryFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="products-empty">{emptyMessage}</p>
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

export default FeaturedProducts
