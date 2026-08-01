import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useShop } from '../../context/ShopContext'
import { footerHome } from '../../data/homeData'
import BrandMonogram from './BrandMonogram'
import TerraEstiloBrandHeader from './TerraEstiloBrandHeader'
import MainNavigation from './MainNavigation'

const { instagramHref, facebookHref } = footerHome.atendimento

const HEADER_TRUST = [
  {
    id: 'frete',
    title: 'Frete grátis',
    detail: 'Acima de R$399',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 7h11v10H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 10h4l3 3v4h-7V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="7" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'troca',
    title: 'Troca fácil',
    detail: 'Até 30 dias',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h10l-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 17H7l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'seguro',
    title: 'Compra segura',
    detail: 'Seus dados protegidos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6" y="11" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'parcela',
    title: 'Parcele em até 6x',
    detail: 'Sem juros',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h2.5l.5-3H14V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Header({
  onMenuToggle,
  menuOpen,
  searchOpen,
  onSearchToggle,
  onNavClose,
}) {
  const {
    searchQuery,
    setSearchQuery,
    performSearch,
    cartCount,
    favoritesCount,
    setCartOpen,
  } = useShop()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const searchAreaRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchToggleRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  const submitSearch = (event) => {
    event?.preventDefault()
    const submitted = performSearch()
    if (submitted && searchOpen) {
      onSearchToggle()
    }
  }

  useEffect(() => {
    const SCROLL_ENTER = 40
    const SCROLL_EXIT = 10
    let ticking = false
    let scrolledNow = window.scrollY > SCROLL_ENTER

    setScrolled(scrolledNow)

    const updateScrolled = () => {
      ticking = false
      const y = window.scrollY
      const next = scrolledNow ? y > SCROLL_EXIT : y > SCROLL_ENTER
      if (next === scrolledNow) return
      scrolledNow = next
      setScrolled(next)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateScrolled)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const chrome = document.querySelector('.site-chrome')
    if (!chrome) return undefined
    chrome.classList.toggle('site-chrome--scrolled', scrolled)
    chrome.classList.toggle('is-scrolled', scrolled)
    return () => {
      chrome.classList.remove('site-chrome--scrolled')
      chrome.classList.remove('is-scrolled')
    }
  }, [scrolled])

  useEffect(() => {
    if (!searchOpen) return undefined

    searchInputRef.current?.focus()

    const handlePointerDown = (event) => {
      const target = event.target
      if (searchAreaRef.current?.contains(target)) return
      if (searchToggleRef.current?.contains(target)) return
      onSearchToggle()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onSearchToggle()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchOpen, onSearchToggle])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onNavClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('nav-drawer-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('nav-drawer-open')
    }
  }, [menuOpen, onNavClose])

  return (
    <div
      className={`brand-main header-main site-header site-header--premium${scrolled ? ' is-scrolled site-header--scrolled' : ''}${menuOpen ? ' site-header--menu-open' : ''}`}
    >
      <div className="site-header__promo" role="note">
        <span className="site-header__promo-rule" aria-hidden="true" />
        <p className="site-header__promo-text">
          Seleção de Inverno: 30% OFF* com o cupom <strong>FRIO</strong>
        </p>
        <span className="site-header__promo-rule" aria-hidden="true" />
      </div>

      <div className="site-header__utility">
        <button
          type="button"
          className={`site-header__menu ${menuOpen ? 'site-header__menu--open' : ''}`}
          aria-label="Abrir menu de navegação"
          aria-expanded={menuOpen}
          aria-controls="site-main-nav"
          onClick={onMenuToggle}
        >
          <span /><span /><span />
        </button>

        <TerraEstiloBrandHeader />

        <div
          ref={searchAreaRef}
          className={`search-area${searchOpen ? ' search-area--open' : ''}`}
        >
          <form
            id="site-header-search"
            className={`site-header__search brand-search ${searchOpen ? 'site-header__search--open' : ''}`}
            role="search"
            onSubmit={submitSearch}
          >
            <button type="submit" className="site-header__search-submit" aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Buscar produtos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitSearch(e)
                }
              }}
              aria-label="Buscar produtos"
            />
          </form>
        </div>

        <div className="site-header__actions header-actions">
          <button
            ref={searchToggleRef}
            type="button"
            className={`site-header__action site-header__action--search${searchOpen ? ' is-active' : ''}`}
            aria-label="Buscar"
            aria-expanded={searchOpen}
            aria-controls="site-header-search"
            onClick={onSearchToggle}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Buscar</span>
          </button>
          <a
            href="#favoritos"
            className="site-header__action site-header__action--favorites"
            aria-label={`Favoritos${favoritesCount > 0 ? `, ${favoritesCount} itens` : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span>Favoritos</span>
            {favoritesCount > 0 && <em className="site-header__badge">{favoritesCount}</em>}
          </a>
          <a
            href={instagramHref}
            className="site-header__action site-header__action--instagram"
            aria-label="Instagram Terra & Estilo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            <span>Instagram</span>
          </a>
          <a
            href={facebookHref}
            className="site-header__action site-header__action--facebook"
            aria-label="Facebook Terra & Estilo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
            <span>Facebook</span>
          </a>
          <button
            type="button"
            className="site-header__action site-header__action--cart"
            onClick={() => setCartOpen(true)}
            aria-label={`Sacola${cartCount > 0 ? `, ${cartCount} itens` : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Sacola</span>
            <em className="site-header__badge">{cartCount}</em>
          </button>
        </div>
      </div>

      <div className="site-header__nav-band">
        <button
          type="button"
          className={`main-nav__backdrop${menuOpen ? ' is-open' : ''}`}
          aria-label="Fechar menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => onNavClose?.()}
        />

        <MainNavigation
          open={menuOpen}
          onClose={onNavClose}
          onOpenCart={() => {
            onNavClose?.()
            setCartOpen(true)
          }}
        />

        {isHome ? (
          <div className="site-header__nav-logo" aria-hidden="true">
            <BrandMonogram />
          </div>
        ) : null}
      </div>

      <ul className="site-header__trust">
        {HEADER_TRUST.map((item) => (
          <li key={item.id} className="site-header__trust-item">
            <span className="site-header__trust-icon">{item.icon}</span>
            <span className="site-header__trust-copy">
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Header
