import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'
import { useState } from 'react'

const NAV = [
  { label: 'Coleções', href: '#colecoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Lojas', href: '#lojas' },
  { label: 'Contato', href: '#contato' },
]

function LandingHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="lp-header">
      <div className="lp-container lp-header__inner">
        <a href="#inicio" className="lp-header__brand" aria-label="Terra & Estilo — início">
          <img
            src={BRAND_LOGO_CIRCULAR_SRC}
            alt="Terra & Estilo"
            className="lp-header__logo"
            width={512}
            height={512}
          />
        </a>

        <nav className={`lp-header__nav ${open ? 'lp-header__nav--open' : ''}`} aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className="lp-header__link" onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="lp-header__actions">
          <button type="button" className="lp-header__icon" aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="lp-header__icon" aria-label="Minha conta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="lp-header__icon" aria-label="Sacola">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          <button
            type="button"
            className={`lp-header__menu ${open ? 'lp-header__menu--open' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader
