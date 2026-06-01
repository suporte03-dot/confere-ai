import { homeFeaturedProducts } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'
import ProductCard from '../ProductCard'

function ProductGrid() {
  const { filteredProducts, categoryFilter, searchQuery } = useShop()

  const hasFilter = categoryFilter !== 'Todos' || searchQuery.trim()
  const products = hasFilter ? filteredProducts : homeFeaturedProducts

  return (
    <section id="produtos" className="product-grid-section section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Destaques da coleção</h2>
          <p className="section-head__desc">
            Peças selecionadas com acabamento refinado e identidade TerraEstilo.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="product-grid-section__empty">Nenhum produto encontrado.</p>
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
