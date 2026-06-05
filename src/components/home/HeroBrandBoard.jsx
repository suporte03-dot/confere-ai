import { headerBrandPillars } from '../../data/homeData'
import RsMapOutline from './RsMapOutline'
import TerraEstiloWordmark from './TerraEstiloWordmark'

function HeroBrandBoard() {
  return (
    <figure className="hero-brand-board">
      <div className="hero-brand-board__frame">
        <div className="hero-brand-board__plate">
          <span className="hero-brand-board__leaves" aria-hidden="true">
            <svg viewBox="0 0 48 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4c-9 18-14 38-12 56 2 14 12 26 12 26s10-12 12-26c2-18-3-38-12-56z" fill="rgba(107,122,78,0.18)" />
              <path d="M10 14c-6 12-7 26-3 38 4 9 10 15 10 15s6-6 10-15c4-12 3-26-3-38-5-7-10-8-14 0z" fill="#6B7A4E" opacity="0.9" />
              <path d="M36 18c6 11 7 24 3 36-4 8-10 14-10 14s-6-6-10-14c-4-12-3-25 3-36 5-6 10-7 14 0z" fill="#4A5C3A" opacity="0.88" />
            </svg>
          </span>

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

          <span className="hero-brand-board__fabric" aria-hidden="true" />
          <div className="hero-brand-board__seal" aria-hidden="true">
            <span className="hero-brand-board__seal-ring">Sul do Brasil · Estilo com propósito</span>
          </div>
        </div>
      </div>
    </figure>
  )
}

export default HeroBrandBoard
