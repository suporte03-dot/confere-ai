const ICONS = {
  camisa: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M22 14 L32 20 L42 14 L52 20 V28 L44 24 V50 H20 V24 L12 28 V20 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M32 20 V28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  vestido: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M24 12 H40 L44 22 L52 50 H12 L20 22 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M28 12 V18 H36 V12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  jaqueta: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M20 16 L32 22 L44 16 L54 24 V52 H42 V34 H22 V52 H10 V24 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M32 22 V52" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  bolsa: (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect
        x="14"
        y="24"
        width="36"
        height="26"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M24 24 V20 C24 14 28 12 32 12 C36 12 40 14 40 20 V24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
}

function CategoryCard({ category, favorite, onToggleFavorite, onNavigate }) {
  const handleClick = (e) => {
    e.preventDefault()
    onNavigate(category.filter)
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(category.id)
  }

  return (
    <a
      href="#produtos"
      className={`category-card category-card--${category.tone}`}
      onClick={handleClick}
    >
      <span
        className={`category-card__badge ${
          category.badge === 'NOVO' ? 'category-card__badge--novo' : 'category-card__badge--destaque'
        }`}
      >
        {category.badge}
      </span>

      <button
        type="button"
        className={`category-card__fav ${favorite ? 'category-card__fav--active' : ''}`}
        aria-label={favorite ? `Remover ${category.title} dos favoritos` : `Adicionar ${category.title} aos favoritos`}
        aria-pressed={favorite}
        onClick={handleFavorite}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} aria-hidden="true">
          <path
            d="M20.8 5.2a4.6 4.6 0 0 0-6.5 0L12 7.5l-2.3-2.3a4.6 4.6 0 1 0-6.5 6.5L12 20.5l8.8-8.8a4.6 4.6 0 0 0 0-6.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="category-card__icon" aria-hidden="true">
        {ICONS[category.icon]}
      </div>

      <h3 className="category-card__title">{category.title}</h3>
      <p className="category-card__signature">Terra &amp; Estilo</p>

      <span className="category-card__footer">
        Visualizar coleção
        <span aria-hidden="true"> →</span>
      </span>
    </a>
  )
}

export default CategoryCard
