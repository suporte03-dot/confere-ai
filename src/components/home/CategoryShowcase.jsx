import { categoryShowcase } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'
import VisualMedia from '../VisualMedia'

function CategoryShowcase() {
  const { navigateToCollection } = useShop()

  const handleClick = (filter, e) => {
    e.preventDefault()
    navigateToCollection(filter)
  }

  return (
    <section id="colecoes" className="category-showcase section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Navegue por categoria</h2>
          <p className="section-head__desc">
            Explore coleções curadas com a identidade TerraEstilo.
          </p>
        </div>
        <div className="category-showcase__grid">
          {categoryShowcase.map((item) => (
            <a
              key={item.id}
              href="#produtos"
              className={`category-showcase__card category-showcase__card--${item.id}`}
              onClick={(e) => handleClick(item.filter, e)}
            >
              <div className="category-showcase__media">
                <VisualMedia
                  src={null}
                  alt={item.title}
                  label={item.title}
                  variant={item.variant}
                  className="category-showcase__visual"
                  imgClassName="category-showcase__img"
                />
              </div>
              <div className="category-showcase__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="category-showcase__link">Explorar →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
