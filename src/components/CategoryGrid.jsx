import { quickCategories } from '../data/mockData'
import VisualMedia from './VisualMedia'

function CategoryGrid() {
  return (
    <section id="categorias" className="section categories">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Navegue por categorias</h2>
          <p className="section-head__desc">Encontre o estilo certo para cada ocasião.</p>
        </div>
        <div className="categories__grid">
          {quickCategories.map((cat) => (
            <a key={cat.id} href="#produtos" className="cat-card">
              <div className="cat-card__visual">
                <VisualMedia
                  src={cat.image}
                  alt={cat.title}
                  label={cat.title}
                  variant={cat.variant}
                  className="cat-card__media"
                  imgClassName="cat-card__img"
                />
              </div>
              <div className="cat-card__body">
                <h3>{cat.title}</h3>
                <span>Explorar →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
