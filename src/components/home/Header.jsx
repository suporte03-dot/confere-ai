import { useEffect, useRef } from 'react'
import { useShop } from '../../context/ShopContext'
import TerraEstiloBrandHeader from './TerraEstiloBrandHeader'
import MainNavigation from './MainNavigation'

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

  const submitSearch = (event) => {
    event?.preventDefault()
    const submitted = performSearch()
    if (submitted && searchOpen) {
      onSearchToggle()
    }
  }

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

  return (
    <div className="brand-main header-main site-header">
      <button
        type="button"
        className={`site-header__menu ${menuOpen ? 'site-header__menu--open' : ''}`}
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        <span /><span /><span />
      </button>

      <TerraEstiloBrandHeader />

      <MainNavigation open={menuOpen} onClose={onNavClose} />

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
          className="site-header__action site-header__action--search"
          aria-label="Buscar"
          aria-expanded={searchOpen}
          aria-controls="site-header-search"
          onClick={onSearchToggle}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <a href="#conta" className="site-header__action" aria-label="Minha conta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </a>
        <button type="button" className="site-header__action" aria-label="Favoritos">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 20s-6.5-4.2-8.8-8A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20.8 12c-2.3 3.8-8.8 8-8.8 8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="site-header__action site-header__action--cart"
          onClick={() => setCartOpen(true)}
          aria-label="Carrinho"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 7h15l-1.4 9.2a1.5 1.5 0 0 1-1.5 1.3H9.2a1.5 1.5 0 0 1-1.5-1.2L6 7z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M6 7 5.2 3.8H2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="20" r="1.3" fill="currentColor" />
            <circle cx="17" cy="20" r="1.3" fill="currentColor" />
          </svg>
          <em className="site-header__badge">{cartCount}</em>
        </button>
      </div>
    </div>
  )
}

export default Header
