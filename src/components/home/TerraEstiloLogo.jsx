import { BRAND_LOGO_SRC } from '../../data/homeData'

function TerraEstiloLogo({ variant = 'header', className = '' }) {
  const rootClass = ['te-logo', `te-logo--${variant}`, className].filter(Boolean).join(' ')

  return (
    <span className={rootClass}>
      <img
        src={BRAND_LOGO_SRC}
        alt="TerraEstilo — Moda que veste origens"
        className="te-logo__img"
        loading={variant === 'header' ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
  )
}

export default TerraEstiloLogo
