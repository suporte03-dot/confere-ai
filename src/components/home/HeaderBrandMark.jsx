/**
 * Marca oficial no header — logo circular Instagram (imagem).
 */
import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

function HeaderBrandMark({ className = '' }) {
  const linkClass = ['brand-logo-composition', 'header-brand__logo-link', className]
    .filter(Boolean)
    .join(' ')

  return (
    <a href="#inicio" className={linkClass} aria-label="Terra & Estilo — Página inicial">
      <img
        src={BRAND_LOGO_CIRCULAR_SRC}
        alt="Terra & Estilo — A marca do agro brasileiro"
        className="header-brand__logo-img"
        width={512}
        height={512}
        decoding="async"
      />
    </a>
  )
}

export default HeaderBrandMark
