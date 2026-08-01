import { Link } from 'react-router-dom'
import { categoryCards } from '../../data/homeData'

function CategoryShowcase() {
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
            <Link
              key={category.id}
              to={category.to}
              className="category-banner"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
