import { heroVisualCard } from '../../data/homeData'
import CollectionCardMark from './CollectionCardMark'

function HeroVisualCard() {
  return (
    <aside className="hero-visual-card" aria-label="Destaque Coleção Raízes do Sul">
      <CollectionCardMark />
      <div className="hero-visual-card__content">
        <p className="hero-visual-card__label">Coleção em destaque</p>
        <h2 className="hero-visual-card__title">{heroVisualCard.title}</h2>
        <p className="hero-visual-card__brand">{heroVisualCard.subtitle}</p>
        <div className="hero-visual-card__badges">
          {heroVisualCard.badges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default HeroVisualCard
