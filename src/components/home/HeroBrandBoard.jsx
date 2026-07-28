import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

function HeroBrandBoard() {
  return (
    <figure className="hero-brand-board">
      <div className="hero-brand-board__frame">
        <div className="hero-brand-board__plate">
          <div className="hero-brand-board__composition">
            <img
              src={BRAND_LOGO_CIRCULAR_SRC}
              alt="Terra & Estilo — A marca do agro brasileiro"
              className="hero-brand-board__logo-img"
              width={1024}
              height={1024}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </figure>
  )
}

export default HeroBrandBoard
