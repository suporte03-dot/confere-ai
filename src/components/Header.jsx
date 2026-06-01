import { useState } from 'react'
import { headerNav } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import BrandMark from './BrandMark'

function Header() {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    favoritesCount,
    setCartOpen,
    navigateToCollection,
  } = useShop()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const closeMobile = () => setMenuOpen(false)

  const handleNav = (item, e) => {
    if (item.filter) {
      e.preventDefault()
      navigateToCollection(item.filter)
    }
    closeMobile()
  }

  return (
    <header className="header">
      <div className="container header__shell">
        <div className="header__row">
          <button
            type="button"
            className={`header__menu-btn ${menuOpen ? 'header__menu-btn--open' : ''}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>

          <a href="#inicio" className="header__logo" aria-label="TerraEstilo — Página inicial">
            <BrandMark variant="header" />
          </a>

          <div className={`header__search ${searchOpen ? 'header__search--open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Buscar roupas, calçados e acessórios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar produtos"
            />
          </div>

          <div className="header__actions">
            <button
              type="button"
              className="header__action header__action--search-toggle"
              aria-label="Buscar"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>Buscar</span>
            </button>
            <a href="#conta" className="header__action" aria-label="Minha conta">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>Conta</span>
            </a>
            <a href="#favoritos" className="header__action" aria-label="Favoritos">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <span>Favoritos</span>
              {favoritesCount > 0 && <em className="header__badge">{favoritesCount}</em>}
            </a>
            <button type="button" className="header__action" onClick={() => setCartOpen(true)} aria-label="Carrinho">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6h15l-1.5 9H8L6 6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="10" cy="19" r="1.5" fill="currentColor" />
                <circle cx="17" cy="19" r="1.5" fill="currentColor" />
              </svg>
              <span>Carrinho</span>
              {cartCount > 0 && <em className="header__badge">{cartCount}</em>}
            </button>
          </div>
        </div>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Principal">
          {headerNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="header__nav-link"
              onClick={(e) => handleNav(item, e)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
