import { featuredCollections } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function CategoryHighlights() {
  const { navigateToCollection } = useShop()

  const handleClick = (filter, e) => {
    e.preventDefault()
    navigateToCollection(filter)
  }

  return (
    <section className="section category-highlights">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Navegue por categorias</h2>
          <p className="section-head__desc">Masculino, feminino e coleções em destaque TerraEstilo.</p>
        </div>
        <div className="category-highlights__grid">
          {featuredCollections.map((item) => (
            <a
              key={item.id}
              href="#produtos"
              className="highlight-card"
              onClick={(e) => handleClick(item.filter, e)}
            >
              <div className="highlight-card__media">
                <VisualMedia
                  src={item.image}
                  alt={item.title}
                  label={item.title}
                  variant={item.variant}
                  className="highlight-card__media-inner"
                  imgClassName="highlight-card__img"
                />
                <div className="highlight-card__overlay" />
              </div>
              <div className="highlight-card__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="highlight-card__cta">Ver produtos →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryHighlights
