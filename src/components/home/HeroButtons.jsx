import { heroContent, footerHome } from '../../data/homeData'

function HeroButtons() {
  const whatsappHref = footerHome.atendimento.whatsappHref

  return (
    <div className="hero-buttons">
      <a href="#produtos" className="hero-btn hero-btn--primary">
        {heroContent.primaryCta}
      </a>
      <a
        href={whatsappHref}
        className="hero-btn hero-btn--secondary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {heroContent.secondaryCta}
      </a>
    </div>
  )
}

export default HeroButtons
