import {
  BRAND_LOGO_HEADER_SRC,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_SRC,
  BRAND_LOGO_WIDTH,
} from '../../data/homeData'

function TerraEstiloLogo({ variant = 'header', className = '' }) {
  const src = variant === 'header' ? BRAND_LOGO_HEADER_SRC : BRAND_LOGO_SRC

  const rootClass = [
    'te-logo',
    'logo-container',
    'site-logo',
    variant === 'header' ? 'header-logo' : '',
    variant === 'hero' ? 'hero-logo-area' : '',
    `te-logo--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={rootClass}>
      <img
        src={src}
        alt="TerraEstilo — Moda que veste origens"
        className="te-logo__img brand-logo"
        width={BRAND_LOGO_WIDTH}
        height={BRAND_LOGO_HEIGHT}
        loading={variant === 'header' || variant === 'hero' ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
  )
}

export default TerraEstiloLogo
