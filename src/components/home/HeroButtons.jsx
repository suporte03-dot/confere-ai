import { Link } from 'react-router-dom'
import { heroContent } from '../../data/homeData'

function HeroButtons() {
  return (
    <div className="brand-hero__actions">
      <Link to="/colecoes" className="brand-hero__btn brand-hero__btn--primary">
        {heroContent.primaryCta}
      </Link>
    </div>
  )
}

export default HeroButtons
