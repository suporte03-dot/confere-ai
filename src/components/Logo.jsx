function BrandIcon() {
  return (
    <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M15.5 5.5C21.5 4 28 4.5 33 7C37.5 9 40.5 13 41.5 18.5C42.5 24 41.5 30 39 36C37 41.5 33 47 28 50.5C26 52 24 52.5 22 51.5C18.5 49 15.5 44.5 13 38C10.5 31 10 23 11.5 16C12.5 11 14 7.5 15.5 5.5Z"
        stroke="#E9DCC7"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11 40C17 35 23 33 29 34.5C35 36 39.5 38.5 42 40.5V44.5C36 41.5 30 40 24 40.5C18 41 14 42.5 11 44V40Z"
        fill="#6B9478"
      />
      <path
        d="M12.5 32C18 28.5 24 27 30 28.5C36 30 40 32.5 42 34.5V38.5C36.5 35.5 30.5 34 24.5 34.5C18.5 35 14.5 36.5 12.5 38V32Z"
        fill="#C8923E"
      />
      <path
        d="M14 25C19 22 24 21 29 22.5C34 24 38 26 41 28V31.5C36 29 31 27.5 26 28C21 28.5 17 29.5 14 31V25Z"
        fill="#4A7358"
      />
      <path
        d="M26 20.5C27.5 18 30 17 32.5 18C35 19 36 21.5 35 24C34 26.5 31.5 28 29 27C26.5 26 25.5 23 26 20.5Z"
        fill="#F5EFE3"
      />
      <path
        d="M32 17.5L36.5 10"
        stroke="#D9A84E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="37" cy="9.5" r="1.5" fill="#D9A84E" />
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
        <span className="brand-brasil">Brasil</span>
      </div>
    </>
  )

  if (href) {
    return (
      <a href={href} className={brandClass} aria-label="TerraBrasil - Página inicial">
        {content}
      </a>
    )
  }

  return <span className={brandClass}>{content}</span>
}

export default Logo
