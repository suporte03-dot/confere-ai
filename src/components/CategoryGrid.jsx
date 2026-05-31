import { femininoCollections } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function CategoryGrid() {
  const { navigateToCollection } = useShop()

  const handleClick = (filter, e) => {
    e.preventDefault()
    navigateToCollection(filter)
  }

  return (
    <section id="categorias" className="section categories">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Coleções Femininas</h2>
          <p className="section-head__desc">Peças versáteis com elegância e conforto para o dia a dia.</p>
        </div>
        <div className="categories__grid">
          {femininoCollections.map((cat) => (
            <a
              key={cat.id}
              href="#produtos"
              className="cat-card"
              onClick={(e) => handleClick(cat.filter, e)}
            >
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
                <span>Ver produtos →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
