'use client'

import Link from 'next/link'
import { categoryCards } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'

function CategoryShowcase({ categories: categoriesProp }) {
  const { categories: contextCategories } = useShop()
  const categories = categoriesProp ?? contextCategories ?? []

  const activeSlugs = new Set(categories.map((c) => c.slug).filter(Boolean))
  const cards =
    activeSlugs.size > 0
      ? categoryCards.filter((card) => {
          if (card.to === '/colecoes') return true
          const slug = String(card.to || '').replace(/^\//, '')
          return activeSlugs.has(slug)
        })
      : categoryCards

  return (
    <section id="categorias" className="categorias-section section" aria-labelledby="categorias-title">
      <div className="container categorias-section__container">
        <div className="section-head section-head--light">
          <p className="section-head__eyebrow">Explore</p>
          <h2 id="categorias-title" className="section-head__title">
            Compre por categoria
          </h2>
          <p className="section-head__desc">
            Feminino, Masculino, Acessórios e Coleções — entre pelas vitrines essenciais.
          </p>
        </div>

        <div className="category-banners">
          {cards.map((category) => (
            <Link
              key={category.id}
              href={category.to}
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
                  Explorar
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
