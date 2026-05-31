import { categoryCards } from '../data/mockData'

function CategoryGrid() {
  return (
    <section id="categorias" className="section categories">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Navegue por categorias</h2>
          <p className="section-head__desc">Encontre o estilo certo para cada ocasião.</p>
        </div>
        <div className="categories__grid">
          {categoryCards.map((cat) => (
            <a key={cat.id} href="#produtos" className="cat-card">
              <div className="cat-card__visual" style={{ background: cat.gradient }}>
                <span className="cat-card__mono">TB</span>
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
