import { filterOptions, getFilterLabel, scrollToProducts } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import ProductCard from './ProductCard'

function ProductShowcase() {
  const { filteredProducts, categoryFilter, setCategoryFilter, searchQuery } = useShop()
  const sectionTitle = categoryFilter === 'Todos'
    ? 'Destaques TerraEstilo'
    : getFilterLabel(categoryFilter)

  const handleFilter = (option) => {
    setCategoryFilter(option)
    scrollToProducts()
  }

  const emptyMessage = searchQuery.trim()
    ? 'Nenhum produto encontrado para sua busca.'
    : 'Nenhum produto encontrado.'

  return (
    <section id="produtos" className="section products-section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">{sectionTitle}</h2>
          <p className="section-head__desc">Peças selecionadas com o estilo da nossa terra.</p>
        </div>

        <div className="products-toolbar">
          <div className="filter-pills" role="group" aria-label="Filtrar produtos">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-pill ${categoryFilter === option ? 'filter-pill--active' : ''}`}
                onClick={() => handleFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="products-empty">{emptyMessage}</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductShowcase
