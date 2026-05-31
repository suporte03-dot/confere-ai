import { filterOptions } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import ProductCard from './ProductCard'

function ProductShowcase() {
  const { filteredProducts, categoryFilter, setCategoryFilter } = useShop()

  return (
    <section id="produtos" className="section products-section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Destaques TerraEstilo</h2>
          <p className="section-head__desc">Peças selecionadas com o estilo da nossa terra.</p>
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

        {filteredProducts.length === 0 ? (
          <p className="products-empty">Nenhum produto encontrado.</p>
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
