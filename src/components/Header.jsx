import { useState, useEffect } from 'react'
import Logo from './Logo'
import { navLinks } from '../data/mockData'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <header className={`header ${menuOpen ? 'header--open' : ''}`}>
      <div className="container header__inner">
        <a href="#inicio" className="header__logo" onClick={closeMenu}>
          <Logo variant="full" size="md" />
        </a>

        <button
          type="button"
          className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`} aria-label="Navegação principal">
          <ul className="nav__list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav__link" onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#upload" className="btn btn--primary btn--sm nav__cta" onClick={closeMenu}>
            Iniciar conferência
          </a>
        </nav>

        <a href="#upload" className="btn btn--primary btn--sm header__cta">
          Iniciar conferência
        </a>
      </div>
    </header>
  )
}

export default Header
