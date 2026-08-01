/**
 * Marca no header — logo circular oficial + wordmark, ou monograma T&E (arte).
 */
import { Link } from 'react-router-dom'
import { BRAND_LOGO_CIRCULAR_SRC, BRAND_MONOGRAM_SRC } from '../../data/homeData'

function HeaderBrandMark({ className = '', showWordmark = false, mark = 'logo' }) {
  const linkClass = ['brand-logo-composition', 'header-brand__logo-link', className]
    .filter(Boolean)
    .join(' ')
  const isMonogram = mark === 'monogram'

  return (
    <Link to="/" className={`${linkClass} site-header__logo`} aria-label="Ir para a página inicial">
      {isMonogram ? (
        <span className="header-brand__monogram-mark">
          <img
            src={BRAND_MONOGRAM_SRC}
            alt="Monograma T&E Terra & Estilo"
            className="header-brand__monogram-img"
            width={127}
            height={96}
            decoding="async"
          />
        </span>
      ) : (
        <span className="header-brand__logo-ring" aria-hidden="true">
          <img
            src={BRAND_LOGO_CIRCULAR_SRC}
            alt=""
            className="header-brand__logo-img"
            width={512}
            height={512}
            decoding="async"
          />
        </span>
      )}
      {showWordmark ? (
        <span className="header-brand__text">
          <span className="header-brand__name">Terra &amp; Estilo</span>
          <span className="header-brand__tagline">Essência em cada detalhe</span>
        </span>
      ) : (
        <span className="header-brand__name visually-hidden">Terra &amp; Estilo</span>
      )}
    </Link>
  )
}

export default HeaderBrandMark
