import { heroContent } from '../../data/homeData'

function HeroButtons() {
  return (
    <div className="brand-hero__actions">
      <a href="#colecoes" className="brand-hero__btn brand-hero__btn--primary">
        {heroContent.primaryCta}
      </a>
      <a href="#contato" className="brand-hero__btn brand-hero__btn--secondary">
        {heroContent.secondaryCta}
      </a>
    </div>
  )
}

export default HeroButtons
