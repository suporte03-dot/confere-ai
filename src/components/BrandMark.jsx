import { BRAND_LOGO_CIRCULAR_SRC } from '../data/homeData'

function BrandMark({
  variant = 'header',
  className = '',
}) {
  const rootClass = [
    'brand-mark',
    `brand-mark--${variant}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={rootClass}>
      <img
        src={BRAND_LOGO_CIRCULAR_SRC}
        alt="Terra & Estilo — A marca do agro brasileiro"
        className="brand-mark__logo-img"
        width={512}
        height={512}
        decoding="async"
      />
    </span>
  )
}

export default BrandMark
