import { useId } from 'react'
import {
  BRAND_COLORS,
  MONOGRAM_E,
  MONOGRAM_T,
  RS_MAP,
} from './brandPaths'

function GoldDefs({ prefix }) {
  return (
    <defs>
      <linearGradient id={`${prefix}-gold`} x1="18" y1="10" x2="82" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={BRAND_COLORS.goldLight} />
        <stop offset="50%" stopColor={BRAND_COLORS.gold600} />
        <stop offset="100%" stopColor={BRAND_COLORS.goldDeep} />
      </linearGradient>
      <clipPath id={`${prefix}-clip`}>
        <path d={RS_MAP} />
      </clipPath>
    </defs>
  )
}

function BrandSymbol() {
  const uid = useId().replace(/:/g, '')
  const grad = `${uid}-gold`
  const clip = `${uid}-clip`

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="brand-symbol"
    >
      <GoldDefs prefix={uid} />

      <path
        d={RS_MAP}
        stroke={`url(#${grad})`}
        strokeWidth="1.15"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      <g clipPath={`url(#${clip})`}>
        <path d={MONOGRAM_T} fill={`url(#${grad})`} />
        <path d={MONOGRAM_E} fill={`url(#${grad})`} />
      </g>
    </svg>
  )
}

function Wordmark() {
  return (
    <div className="logo-wordmark">
      <span className="logo-terra">Terra</span>
      <span className="logo-estilo">Estilo</span>
    </div>
  )
}

function Logo({ variant = 'full', tone = 'light', showTagline = false, className = '' }) {
  const rootClass = [
    variant === 'full' ? 'logo-full' : 'logo',
    tone === 'dark' ? 'logo--dark' : '',
    showTagline ? 'logo--stacked' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (variant === 'icon') {
    return (
      <div className={rootClass} aria-hidden="true">
        <div className="logo-icon">
          <BrandSymbol />
        </div>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={rootClass}>
        <Wordmark />
        {showTagline && <span className="logo-tagline">Moda que veste origens</span>}
      </div>
    )
  }

  return (
    <div className={rootClass}>
      <div className="logo-icon" aria-hidden="true">
        <BrandSymbol />
      </div>
      <div className="logo-copy">
        <Wordmark />
        {showTagline && <span className="logo-tagline">Moda que veste origens</span>}
      </div>
    </div>
  )
}

export default Logo
