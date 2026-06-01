import { homeCategories } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import VisualMedia from './VisualMedia'

function HomeCategories() {
  const { navigateToCollection } = useShop()

  const handleClick = (filter, e) => {
    e.preventDefault()
    navigateToCollection(filter)
  }

  return (
    <section id="colecoes" className="section category-highlights">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Navegue por categorias</h2>
          <p className="section-head__desc">
            Descubra coleções curadas com a identidade TerraEstilo.
          </p>
        </div>

        <div className="category-highlights__grid category-highlights__grid--home">
          {homeCategories.map((item) => (
            <a
              key={item.id}
              href="#produtos"
              className="highlight-card"
              onClick={(e) => handleClick(item.filter, e)}
            >
              <div className="highlight-card__media">
                <VisualMedia
                  src={null}
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
                <span className="highlight-card__cta">Explorar categoria →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeCategories
