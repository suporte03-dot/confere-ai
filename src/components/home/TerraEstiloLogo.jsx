import {
  BRAND_LOGO_CIRCULAR_SRC,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_WIDTH,
} from '../../data/homeData'
import HeaderBrandMark from './HeaderBrandMark'

function TerraEstiloLogo({ variant = 'header', className = '' }) {
  if (variant === 'header') {
    return <HeaderBrandMark className={className} />
  }

  const rootClass = [
    'te-logo',
    'logo-container',
    'site-logo',
    variant === 'hero' ? 'hero-logo' : '',
    `te-logo--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={rootClass}>
      <img
        src={BRAND_LOGO_CIRCULAR_SRC}
        alt="Terra & Estilo — A marca do agro brasileiro"
        className="te-logo__img brand-logo"
        width={BRAND_LOGO_WIDTH}
        height={BRAND_LOGO_HEIGHT}
        loading={variant === 'hero' ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
  )
}

export default TerraEstiloLogo
