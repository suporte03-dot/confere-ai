import { useId } from 'react'
import {
  BRAND_COLORS,
  BRAND_MONOGRAM,
  RS_MAP,
} from './brandPaths'

function BrandDefs({ prefix }) {
  return (
    <defs>
      <linearGradient
        id={`${prefix}-gold`}
        x1="14"
        y1="8"
        x2="88"
        y2="92"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor={BRAND_COLORS.goldSoft} />
        <stop offset="48%" stopColor={BRAND_COLORS.gold} />
        <stop offset="100%" stopColor="#A8894A" />
      </linearGradient>
      <clipPath id={`${prefix}-clip`}>
        <path d={RS_MAP} />
      </clipPath>
    </defs>
  )
}

function BrandSymbol({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const grad = `${uid}-gold`
  const clip = `${uid}-clip`

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`brand-logo__svg ${className}`.trim()}
    >
      <BrandDefs prefix={uid} />

      <path
        d={RS_MAP}
        stroke={`url(#${grad})`}
        strokeWidth="0.85"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />

      <g clipPath={`url(#${clip})`}>
        <text
          x="22"
          y="54"
          fill={`url(#${grad})`}
          fontFamily={BRAND_MONOGRAM}
          fontSize="31"
          fontWeight="600"
          letterSpacing="-0.02em"
        >
          T
        </text>
        <text
          x="39"
          y="57"
          fill={`url(#${grad})`}
          fontFamily={BRAND_MONOGRAM}
          fontSize="18"
          fontWeight="600"
          letterSpacing="-0.01em"
        >
          E
        </text>
      </g>
    </svg>
  )
}

function BrandWordmark() {
  return (
    <div className="brand-logo__wordmark" aria-label="TerraEstilo">
      <span className="brand-logo__terra">Terra</span>
      <span className="brand-logo__estilo">Estilo</span>
    </div>
  )
}

function BrandLogo({
  variant = 'full',
  tone = 'light',
  showTagline = false,
  className = '',
}) {
  const rootClass = [
    'brand-logo',
    variant === 'full' ? 'brand-logo--full' : '',
    variant === 'icon' ? 'brand-logo--icon' : '',
    variant === 'wordmark' ? 'brand-logo--wordmark' : '',
    tone === 'dark' ? 'brand-logo--dark' : 'brand-logo--light',
    showTagline ? 'brand-logo--stacked' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (variant === 'icon') {
    return (
      <div className={rootClass} aria-hidden="true">
        <div className="brand-logo__symbol">
          <BrandSymbol />
        </div>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={rootClass}>
        <BrandWordmark />
        {showTagline && (
          <span className="brand-logo__tagline">Moda que veste origens</span>
        )}
      </div>
    )
  }

  return (
    <div className={rootClass}>
      <div className="brand-logo__symbol" aria-hidden="true">
        <BrandSymbol />
      </div>
      <div className="brand-logo__copy">
        <BrandWordmark />
        {showTagline && (
          <span className="brand-logo__tagline">Moda que veste origens</span>
        )}
      </div>
    </div>
  )
}

export default BrandLogo
