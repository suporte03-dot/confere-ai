import { useId } from 'react'
import { BRAND_COLORS, BRAND_SERIF, RS_MAP } from './brandPaths'

function BrandSymbol({ tone = 'default' }) {
  const uid = useId().replace(/:/g, '')
  const clipId = `rs-clip-${uid}`

  const eColor = tone === 'light' ? BRAND_COLORS.cream100 : BRAND_COLORS.green800

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={RS_MAP} />
        </clipPath>
      </defs>

      <path
        d={RS_MAP}
        stroke={BRAND_COLORS.gold600}
        strokeWidth="1.35"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      <g clipPath={`url(#${clipId})`}>
        <text
          x="21.5"
          y="37.5"
          fill={BRAND_COLORS.gold600}
          fontFamily={BRAND_SERIF}
          fontSize="21"
          fontWeight="700"
        >
          T
        </text>
        <text
          x="32.5"
          y="37"
          fill={eColor}
          fontFamily={BRAND_SERIF}
          fontSize="15.5"
          fontWeight="700"
        >
          E
        </text>
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

function Logo({ variant = 'full', tone = 'default', className = '' }) {
  const rootClass = [
    variant === 'full' ? 'logo-full' : 'logo',
    tone === 'light' ? 'logo--light' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (variant === 'icon') {
    return (
      <div className={rootClass} aria-hidden="true">
        <div className="logo-icon">
          <BrandSymbol tone={tone} />
        </div>
      </div>
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={rootClass}>
        <Wordmark />
      </div>
    )
  }

  return (
    <div className={rootClass}>
      <div className="logo-icon" aria-hidden="true">
        <BrandSymbol tone={tone} />
      </div>
      <Wordmark />
    </div>
  )
}

export default Logo
