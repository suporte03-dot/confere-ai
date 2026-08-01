import { categoryCards } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'

function CategoryShowcase() {
  const { navigateToCollection } = useShop()

  return (
    <section id="categorias" className="categorias-section section" aria-labelledby="categorias-title">
      <div className="container categorias-section__container">
        <div className="section-head section-head--light">
          <p className="section-head__eyebrow">Explore</p>
          <h2 id="categorias-title" className="section-head__title">
            Compre por categoria
          </h2>
          <p className="section-head__desc">
            Entre pelas coleções essenciais — Feminino, Masculino e Acessórios.
          </p>
        </div>

        <div className="category-banners">
          {categoryCards.map((category) => (
            <button
              key={category.id}
              type="button"
              className="category-banner"
              onClick={() => navigateToCollection(category.filter)}
            >
              <img
                src={category.image}
                alt=""
                className="category-banner__img"
                style={{ objectPosition: category.objectPosition || 'center' }}
                loading="lazy"
                decoding="async"
              />
              <span className="category-banner__shade" aria-hidden="true" />
              <span className="category-banner__content">
                <span className="category-banner__title">{category.title}</span>
                <span className="category-banner__subtitle">{category.subtitle}</span>
                <span className="category-banner__cta">
                  Ver peças
                  <span aria-hidden="true"> →</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
