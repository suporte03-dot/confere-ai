function MonogramIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#1F3D2E" stroke="#C9A86A" strokeWidth="1.5" />
      <path
        d="M19 18h12v4.5H25v21h-4V22.5h-6V18z"
        fill="#C9A86A"
      />
      <path
        d="M33 18h11v4.5h-7v5.5h6v4h-6v5.5h7V38H33V18z"
        fill="#F4EFE6"
      />
    </svg>
  )
}

function BrandMark({
  variant = 'header',
  showWordmark = true,
  showTagline = false,
  className = '',
}) {
  const rootClass = [
    'brand-mark',
    `brand-mark--${variant}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={rootClass}>
      <MonogramIcon className="brand-mark__icon" />
      {(showWordmark || showTagline) && (
        <span className="brand-mark__text">
          {showWordmark && <span className="brand-mark__wordmark">TerraEstilo</span>}
          {showTagline && (
            <span className="brand-mark__tagline">Moda que veste origens</span>
          )}
        </span>
      )}
    </span>
  )
}

export default BrandMark
