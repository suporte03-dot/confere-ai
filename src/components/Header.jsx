import { useState } from 'react'
import Logo from './Logo'
import { mainNav, getSubcategoriesForNav } from '../data/mockData'
import { useShop } from '../context/ShopContext'

function NavDropdown({ item, onNavigate, onCloseMobile }) {
  const subcategories = getSubcategoriesForNav(item.id)

  const handleNav = (filterId, e) => {
    e.preventDefault()
    onNavigate(filterId)
    onCloseMobile()
  }

  return (
    <div className="cat-nav__item cat-nav__item--dropdown">
      <button
        type="button"
        className="cat-nav__link cat-nav__link--trigger"
        aria-haspopup="true"
      >
        {item.title}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      <div className="cat-nav__dropdown">
        <a
          href="#produtos"
          className="cat-nav__dropdown-all"
          onClick={(e) => handleNav(item.filter, e)}
        >
          Ver tudo em {item.title}
        </a>
        <ul className="cat-nav__dropdown-list">
          {subcategories.map((sub) => (
            <li key={sub.id}>
              <a
                href="#produtos"
                className="cat-nav__dropdown-link"
                onClick={(e) => handleNav(sub.id, e)}
              >
                {sub.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MobileNavGroup({ item, onNavigate, onCloseMobile }) {
  const [open, setOpen] = useState(false)
  const subcategories = getSubcategoriesForNav(item.id)

  const handleNav = (filterId, e) => {
    e.preventDefault()
    onNavigate(filterId)
    onCloseMobile()
    setOpen(false)
  }

  return (
    <div className={`cat-nav__mobile-group ${open ? 'cat-nav__mobile-group--open' : ''}`}>
      <button
        type="button"
        className="cat-nav__mobile-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {item.title}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {open && (
        <div className="cat-nav__mobile-sub">
          <a
            href="#produtos"
            className="cat-nav__mobile-link cat-nav__mobile-link--all"
            onClick={(e) => handleNav(item.filter, e)}
          >
            Ver tudo em {item.title}
          </a>
          {subcategories.map((sub) => (
            <a
              key={sub.id}
              href="#produtos"
              className="cat-nav__mobile-link"
              onClick={(e) => handleNav(sub.id, e)}
            >
              {sub.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

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

  const closeMobile = () => setMenuOpen(false)

  const handleSimpleNav = (filterId, e) => {
    e.preventDefault()
    navigateToCollection(filterId)
    closeMobile()
  }

  return (
    <header className="header">
      <div className="container header__main">
        <button
          type="button"
          className={`header__menu-btn ${menuOpen ? 'header__menu-btn--open' : ''}`}
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <a href="#inicio" className="header__logo">
          <Logo />
        </a>

        <div className="header__search">
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

      <nav className={`cat-nav ${menuOpen ? 'cat-nav--open' : ''}`} aria-label="Categorias">
        <div className="container cat-nav__inner cat-nav__inner--desktop">
          {mainNav.map((item) =>
            item.hasDropdown ? (
              <NavDropdown
                key={item.id}
                item={item}
                onNavigate={navigateToCollection}
                onCloseMobile={closeMobile}
              />
            ) : (
              <a
                key={item.id}
                href="#produtos"
                className="cat-nav__link"
                onClick={(e) => handleSimpleNav(item.filter, e)}
              >
                {item.title}
              </a>
            ),
          )}
        </div>

        <div className="container cat-nav__inner cat-nav__inner--mobile">
          {mainNav.map((item) =>
            item.hasDropdown ? (
              <MobileNavGroup
                key={item.id}
                item={item}
                onNavigate={navigateToCollection}
                onCloseMobile={closeMobile}
              />
            ) : (
              <a
                key={item.id}
                href="#produtos"
                className="cat-nav__mobile-link cat-nav__mobile-link--top"
                onClick={(e) => handleSimpleNav(item.filter, e)}
              >
                {item.title}
              </a>
            ),
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
