function LogoIcon({ size = 40, className = '' }) {
  const gradId = `logo-grad-${size}`
  const glowId = `logo-glow-${size}`

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#061A2F" />
          <stop offset="0.55" stopColor="#0B2447" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <radialGradient id={glowId} cx="0" cy="0" r="1" gradientTransform="translate(28 12) rotate(90) scale(14)">
          <stop stopColor="#06B6D4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="40" height="40" rx="11" fill={`url(#${gradId})`} />
      <rect x="1" y="1" width="38" height="38" rx="10" stroke="rgba(255,255,255,0.12)" />
      <circle cx="28" cy="12" r="10" fill={`url(#${glowId})`} />

      <rect x="8.5" y="7" width="14.5" height="18.5" rx="2.5" fill="#fff" fillOpacity="0.96" />
      <path d="M11.5 11.5h8.5M11.5 14.8h6.2M11.5 18h7.2M11.5 21.2h5" stroke="#12355B" strokeWidth="1.3" strokeLinecap="round" />

      <circle cx="26.5" cy="26" r="7" stroke="#fff" strokeWidth="1.7" fill="rgba(6,26,47,0.15)" />
      <path d="M31.2 31.2l3.3 3.3" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M23.8 26l2 2 4.2-4.4"
        stroke="#06B6D4"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M30.5 9.5l1.2 1.2 2.6-2.6"
        stroke="#F59E0B"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="10.5" r="2.2" fill="#F59E0B" fillOpacity="0.92" />
    </svg>
  )
}

function Logo({ variant = 'default', showText = true }) {
  const isFooter = variant === 'footer'

  return (
    <span className={`logo ${isFooter ? 'logo--footer' : ''}`}>
      <LogoIcon size={isFooter ? 36 : 42} className="logo__mark" />
      {showText && (
        <span className="logo__wordmark">
          <span className="logo__confere">Confere</span>
          <span className="logo__ai">AI</span>
        </span>
      )}
    </span>
  )
}

export { LogoIcon }
export default Logo
