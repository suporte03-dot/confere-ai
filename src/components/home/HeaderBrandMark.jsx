/**
 * Marca no header — logo circular + nome da marca.
 */
import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

function HeaderBrandMark({ className = '' }) {
  const linkClass = ['brand-logo-composition', 'header-brand__logo-link', className]
    .filter(Boolean)
    .join(' ')

  return (
    <a href="#inicio" className={linkClass} aria-label="Terra & Estilo — Página inicial">
      <span className="header-brand__logo-ring">
        <img
          src={BRAND_LOGO_CIRCULAR_SRC}
          alt=""
          className="header-brand__logo-img"
          width={512}
          height={512}
          decoding="async"
        />
      </span>
      <span className="header-brand__name" aria-hidden="true">
        Terra &amp; Estilo
      </span>
    </a>
  )
}

export default HeaderBrandMark
