import { useEffect, useRef, useState } from 'react'
import { useShop } from '../../context/ShopContext'
import { footerHome } from '../../data/homeData'
import TerraEstiloBrandHeader from './TerraEstiloBrandHeader'
import MainNavigation from './MainNavigation'

const { instagramHref, facebookHref } = footerHome.atendimento

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
    setCartOpen,
  } = useShop()
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
    const onScroll = () => {
      setScrolled(window.scrollY > 28)
    }
    onScroll()
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
      className={`brand-main header-main site-header${scrolled ? ' is-scrolled site-header--scrolled' : ''}${menuOpen ? ' site-header--menu-open' : ''}`}
    >
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
            placeholder="Buscar roupas, calçados e acessórios..."
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 8h14l-1.1 11.2a1.5 1.5 0 0 1-1.5 1.3H7.6a1.5 1.5 0 0 1-1.5-1.3L5 8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 8V6.5a3 3 0 0 1 6 0V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Sacola</span>
          <em className="site-header__badge">{cartCount}</em>
        </button>
      </div>
    </div>
  )
}

export default Header
