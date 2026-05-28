import { useId } from 'react'

const SIZES = {
  sm: { icon: 28, text: '0.975rem', gap: 8 },
  md: { icon: 38, text: '1.22rem', gap: 11 },
  lg: { icon: 48, text: '1.5rem', gap: 13 },
}

function LogoMark({ size = 38, className = '', title = 'ConfereAI', decorative = false }) {
  const uid = useId().replace(/:/g, '')
  const bgId = `ca-bg-${uid}`
  const shineId = `ca-shine-${uid}`

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      <defs>
        <linearGradient id={bgId} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#061A2F" />
          <stop offset="0.42" stopColor="#0B2447" />
          <stop offset="0.78" stopColor="#2563EB" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id={shineId} x1="24" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="13" fill={`url(#${bgId})`} />
      <rect x="1.5" y="1.5" width="45" height="45" rx="11.5" stroke="rgba(255,255,255,0.14)" />
      <path
        d="M6 14C6 8.5 10.5 4 16 4h16c5.5 0 10 4.5 10 10v2H6v-2z"
        fill={`url(#${shineId})`}
      />

      <rect x="11.5" y="10" width="14.5" height="18.5" rx="2.5" fill="#FFFFFF" fillOpacity="0.18" />
      <rect x="8.5" y="13" width="15" height="19.5" rx="2.5" fill="#FFFFFF" />
      <path
        d="M11.8 17.8h9.4M11.8 21.2h7.2M11.8 24.6h8.4"
        stroke="#0B2447"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <path d="M17.8 21.2h3.2" stroke="#F59E0B" strokeWidth="1.55" strokeLinecap="round" />

      <circle cx="29.5" cy="29.5" r="8.8" stroke="#FFFFFF" strokeWidth="2.15" fill="rgba(6,26,47,0.18)" />
      <path d="M35.6 35.6l4.8 4.8" stroke="#FFFFFF" strokeWidth="2.15" strokeLinecap="round" />

      <path
        d="M25.8 29.6l2.1 2.1 4.8-5"
        stroke="#10B981"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="37.2" cy="11.2" r="3.6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.15" />
      <path d="M37.2 9.4v2.6" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="37.2" cy="13.35" r="0.65" fill="#FFFFFF" />

      <path
        d="M14 38.5h7M21 40.5h7"
        stroke="#06B6D4"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <circle cx="14" cy="38.5" r="1.35" fill="#06B6D4" fillOpacity="0.85" />
      <circle cx="21" cy="40.5" r="1.35" fill="#06B6D4" fillOpacity="0.65" />
      <circle cx="28" cy="38.5" r="1.35" fill="#10B981" fillOpacity="0.9" />
    </svg>
  )
}

function LogoWordmark({ size = 'md', tone = 'default', className = '' }) {
  const textSize = SIZES[size]?.text || SIZES.md.text

  return (
    <span
      className={`logo__wordmark ${tone === 'light' ? 'logo__wordmark--light' : ''} ${className}`}
      style={{ fontSize: textSize }}
    >
      <span className="logo__confere">Confere</span>
      <span className="logo__ai">AI</span>
    </span>
  )
}

function Logo({ variant = 'full', size = 'md', tone = 'default', className = '' }) {
  const config = SIZES[size] || SIZES.md
  const showIcon = variant === 'full' || variant === 'icon'
  const showText = variant === 'full' || variant === 'wordmark'

  return (
    <span
      className={[
        'logo',
        `logo--${size}`,
        tone === 'light' ? 'logo--light' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ gap: config.gap }}
    >
      {showIcon && (
        <LogoMark size={config.icon} className="logo__mark" decorative={showText} />
      )}
      {showText && <LogoWordmark size={size} tone={tone} />}
    </span>
  )
}

export { LogoMark, LogoWordmark }
export default Logo
