import { heroContent } from '../../data/homeData'

function HeroButtons() {
  return (
    <div className="brand-hero__actions">
      <a href="#novidades" className="brand-hero__btn brand-hero__btn--primary">
        {heroContent.primaryCta}
      </a>
    </div>
  )
}

export default HeroButtons
