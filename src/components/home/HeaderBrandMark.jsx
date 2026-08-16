/**
 * Marca no header — logo circular oficial + wordmark.
 */
'use client'

import Link from 'next/link'
import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

function HeaderBrandMark({ className = '', showWordmark = false }) {
  const linkClass = ['brand-logo-composition', 'header-brand__logo-link', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Link href="/" className={`${linkClass} site-header__logo`} aria-label="Ir para a página inicial">
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
