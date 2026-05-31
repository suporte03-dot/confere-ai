import { categoryHighlights } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function CategoryHighlights() {
  const { setCategoryFilter } = useShop()

  return (
    <section className="section category-highlights">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Explore por departamento</h2>
          <p className="section-head__desc">Encontre peças para cada estilo e ocasião.</p>
        </div>
        <div className="category-highlights__grid">
          {categoryHighlights.map((item) => (
            <a
              key={item.id}
              href="#produtos"
              className="highlight-card"
              onClick={() => setCategoryFilter(item.filter)}
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
                <span>Ver produtos →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryHighlights
