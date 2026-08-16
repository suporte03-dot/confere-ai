import santaHero from '../../assets/santa-hero.png'
import { staticAssetSrc } from '../../utils/staticAssetSrc'

function DecorativeBottomBand() {
  return (
    <div className="hero-band" aria-hidden="true">
      <div className="hero-band__curve">
        <div className="hero-band__pattern" />
        <div className="hero-band__gold-edge" />
        <img
          src={staticAssetSrc(santaHero)}

          alt=""
          className="hero-band__aparecida"
          decoding="async"
        />
      </div>
    </div>
  )
}

export default DecorativeBottomBand
