import { categoryCards } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'
import CategoryCard from './CategoryCard'

function CategoryShowcase() {
  const { navigateToCollection, toggleFavorite, isFavorite } = useShop()

  return (
    <section id="colecoes" className="categorias-section section" aria-labelledby="categorias-title">
      <div className="container categorias-section__container">
        <div className="section-head section-head--light">
          <h2 id="categorias-title" className="section-head__title">
            Navegue por categoria
          </h2>
          <p className="section-head__desc">
            Explore as coleções essenciais da Terra &amp; Estilo.
          </p>
        </div>

        <div className="category-grid">
          {categoryCards.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              favorite={isFavorite(category.id)}
              onToggleFavorite={toggleFavorite}
              onNavigate={navigateToCollection}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
