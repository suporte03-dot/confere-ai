import { useId } from 'react'
import { BRAND_COLORS, RS_MAP } from './brandPaths'

function BrandIcon({ compact = false }) {
  const uid = useId().replace(/:/g, '')
  const clipId = `rs-clip-${uid}`
  const fillId = `rs-fill-${uid}`

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mapa do Rio Grande do Sul"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={RS_MAP} />
        </clipPath>
        <linearGradient id={fillId} x1="14" y1="8" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor={BRAND_COLORS.greenSoft} stopOpacity="0.55" />
          <stop offset="1" stopColor={BRAND_COLORS.greenDeep} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <path d={RS_MAP} fill={`url(#${fillId})`} />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M14 41.5C21 37.5 29 36 37 37.5C43 38.5 47.5 40.5 50 42.5"
          stroke={BRAND_COLORS.goldLight}
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M15.5 35.5C22 32 29.5 31 36.5 32.5C43 34 47.5 36 50 38"
          stroke={BRAND_COLORS.gold}
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.38"
        />
        <path
          d="M31.5 27.5C33.2 24.8 36.2 23.6 39.2 24.6C42.2 25.6 43.4 28.4 42.4 31.2C41.4 33.8 38.6 35.4 35.8 34.8C33 34.1 31.4 31.2 31.5 27.5Z"
          fill={BRAND_COLORS.sand}
          fillOpacity="0.95"
        />
        <path
          d="M38.8 25.2L42.8 17.8"
          stroke={BRAND_COLORS.gold}
          strokeWidth={compact ? '1.1' : '1.25'}
          strokeLinecap="round"
        />
        <circle cx="43.2" cy="16.8" r="1.15" fill={BRAND_COLORS.gold} />
      </g>

      <path
        d={RS_MAP}
        stroke={BRAND_COLORS.gold}
        strokeWidth="1.85"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function Logo({ variant = 'default', href = null, className = '' }) {
  const isLight = variant === 'light'
  const brandClass = ['brand', isLight ? 'brand--light' : '', className].filter(Boolean).join(' ')

  const content = (
    <>
      <div className="brand-icon" aria-hidden="true">
        <BrandIcon />
      </div>
      <div className="brand-wordmark">
        <span className="brand-text">
          <span className="brand-terra">Terra</span>
          <span className="brand-estilo">Estilo</span>
        </span>
        {!isLight && <span className="brand-sub">Moda gaúcha premium</span>}
      </div>
    </>
  )

  if (href) {
    return (
      <a href={href} className={brandClass} aria-label="TerraEstilo - Página inicial">
        {content}
      </a>
    )
  }

  return <span className={brandClass}>{content}</span>
}

export default Logo
