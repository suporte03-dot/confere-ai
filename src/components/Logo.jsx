import { useId } from 'react'
import { BRAND_COLORS, RS_MAP } from './brandPaths'

function BrandIcon() {
  const uid = useId().replace(/:/g, '')
  const clipId = `rs-clip-${uid}`

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa do Rio Grande do Sul">
      <defs>
        <clipPath id={clipId}>
          <path d={RS_MAP} />
        </clipPath>
      </defs>

      <path d={RS_MAP} fill={BRAND_COLORS.mapFill} fillOpacity="0.5" />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M13.5 43.5C20 38.5 27.5 36.5 35 38C42.5 39.5 47.5 42 50.5 44.5V48C43 44.5 35.5 43 28 44C20.5 45 16 46 13.5 47.5V43.5Z"
          fill={BRAND_COLORS.green}
          opacity="0.9"
        />
        <path
          d="M14.5 36.5C21 32.5 28 31 35 32.5C42 34 47 36.5 50 39.5V43C43 39.5 35.5 38 28.5 39C21.5 40 17 41 14.5 42.5V36.5Z"
          fill={BRAND_COLORS.gold}
        />
        <path
          d="M16 30C22 27 28.5 26 35 27.5C41.5 29 46 31 49 33.5V36.5C42.5 34 35.5 32.5 29 33.5C22.5 34.5 18.5 35.5 16 37V30Z"
          fill={BRAND_COLORS.greenDeep}
          opacity="0.8"
        />
        <path
          d="M20 47.5C27 43.5 35 42.5 43 44.5"
          stroke={BRAND_COLORS.sand}
          strokeWidth="0.85"
          strokeLinecap="round"
          opacity="0.4"
          strokeDasharray="2.5 2"
        />
        <path
          d="M30.5 27C32.5 23.8 36 22.5 39.5 23.5C43 24.5 44.5 27.5 43.5 30.5C42.5 33.5 39.5 35.5 36.5 35C33.5 34.5 31.5 31.5 30.5 27Z"
          fill={BRAND_COLORS.sand}
        />
        <path
          d="M32 28.5H41"
          stroke={BRAND_COLORS.greenDeep}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.28"
        />
        <path
          d="M39 24L44.5 14.5"
          stroke={BRAND_COLORS.gold}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="45.2" cy="13.5" r="1.9" fill={BRAND_COLORS.gold} />
        <circle cx="45.2" cy="13.5" r="0.8" fill={BRAND_COLORS.sand} />
      </g>

      <path
        d={RS_MAP}
        stroke={BRAND_COLORS.gold}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={RS_MAP}
        stroke={BRAND_COLORS.sand}
        strokeWidth="0.9"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
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
      <div className="brand-text">
        <span className="brand-terra">Terra</span>
        <span className="brand-estilo">Estilo</span>
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
