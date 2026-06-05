import { headerBrandPillars } from '../../data/homeData'
import RsMapOutline from './RsMapOutline'
import TerraEstiloWordmark from './TerraEstiloWordmark'

function HeroBrandBoard() {
  return (
    <figure className="hero-brand-board">
      <div className="hero-brand-board__frame">
        <div className="hero-brand-board__plate">
          <ul className="hero-brand-board__pillars" aria-label="Valores da marca">
            {headerBrandPillars.map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>

          <div className="hero-brand-board__composition">
            <div className="hero-brand-board__monogram-wrap" aria-hidden="true">
              <RsMapOutline className="hero-brand-board__rs-map" />
              <div className="hero-brand-board__symbol">
                <span className="hero-brand-board__letter-t">T</span>
                <span className="hero-brand-board__letter-e">E</span>
              </div>
            </div>
            <TerraEstiloWordmark variant="on-cream" className="hero-brand-board__wordmark" />
            <span className="hero-brand-board__tagline">Moda que veste origens</span>
            <span className="hero-brand-board__rule" aria-hidden="true" />
          </div>

          <div className="hero-brand-board__seal" aria-hidden="true">
            <span className="hero-brand-board__seal-ring">Sul do Brasil · Estilo com propósito</span>
          </div>
        </div>
      </div>
    </figure>
  )
}

export default HeroBrandBoard
