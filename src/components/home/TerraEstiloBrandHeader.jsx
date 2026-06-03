import { headerBrandPillars } from '../../data/homeData'
import HeaderBrandMark from './HeaderBrandMark'

function BrandLeaves() {
  return (
    <span className="terra-brand-header__leaves" aria-hidden="true">
      <svg viewBox="0 0 48 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4c-9 18-14 38-12 56 2 14 12 26 12 26s10-12 12-26c2-18-3-38-12-56z"
          fill="rgba(107,122,78,0.22)"
        />
        <path
          d="M10 14c-6 12-7 26-3 38 4 9 10 15 10 15s6-6 10-15c4-12 3-26-3-38-5-7-10-8-14 0z"
          fill="#6B7A4E"
          opacity="0.92"
        />
        <path
          d="M36 18c6 11 7 24 3 36-4 8-10 14-10 14s-6-6-10-14c-4-12-3-25 3-36 5-6 10-7 14 0z"
          fill="#4A5C3A"
          opacity="0.9"
        />
        <path
          d="M16 42c-4 10-4 20 0 30 3 5 6 10 6 10s3-5 6-10c4-10 4-20 0-30-2-5-5-6-6 0z"
          fill="#6B7A4E"
          opacity="0.8"
        />
        <path
          d="M28 50c4 9 4 18 0 27-2 4-4 8-4 8s-2-4-4-8c-4-9-4-18 0-27 2-4 4-5 4 0z"
          fill="#5A6B42"
          opacity="0.85"
        />
        <path
          d="M20 68c-3 6-3 12 0 18 2 3 4 6 4 6s2-3 4-6c3-6 3-12 0-18-2-3-4-4-4 0z"
          fill="#6B7A4E"
          opacity="0.72"
        />
      </svg>
    </span>
  )
}

function TerraEstiloBrandHeader() {
  return (
    <div className="terra-brand-header header-brand" aria-label="Marca TerraEstilo">
      <BrandLeaves />
      <ul className="terra-brand-header__values header-brand__pillars" aria-label="Valores da marca">
        {headerBrandPillars.map((pillar) => (
          <li key={pillar}>
            <span>{pillar}</span>
          </li>
        ))}
      </ul>
      <div className="terra-brand-header__logo header-brand__mark">
        <HeaderBrandMark />
      </div>
    </div>
  )
}

export default TerraEstiloBrandHeader
