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
        <a href="#inicio" className="lp-header__brand" aria-label="TerraEstilo — início">
          <img
            src="/images/brand/logo-terraestilo-horizontal.png"
            alt="TerraEstilo"
            className="lp-header__logo"
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.4 8.2H7.4L6 6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="10" cy="19" r="1.4" fill="currentColor" />
              <circle cx="17" cy="19" r="1.4" fill="currentColor" />
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
