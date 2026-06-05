import { useShop } from '../../context/ShopContext'
import TerraEstiloBrandHeader from './TerraEstiloBrandHeader'

function Header({ onMenuToggle, menuOpen, searchOpen, onSearchToggle }) {
  const {
    searchQuery,
    setSearchQuery,
    performSearch,
    cartCount,
    favoritesCount,
    setCartOpen,
  } = useShop()

  const submitSearch = (event) => {
    event?.preventDefault()
    const submitted = performSearch()
    if (submitted && searchOpen) {
      onSearchToggle()
    }
  }

  const handleSearchIconClick = () => {
    if (searchOpen) {
      submitSearch()
      return
    }
    const submitted = performSearch()
    if (!submitted) {
      onSearchToggle()
    }
  }

  return (
    <header className="site-header brand-header">
      <div className="brand-main header-main">
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

        <div className="search-area">
          <form
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
            type="button"
            className="site-header__action site-header__action--search"
            aria-label="Buscar"
            onClick={handleSearchIconClick}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Buscar</span>
          </button>
          <a href="#conta" className="site-header__action" aria-label="Minha conta">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Conta</span>
          </a>
          <a href="#favoritos" className="site-header__action" aria-label="Favoritos">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span>Favoritos</span>
            {favoritesCount > 0 && <em className="site-header__badge">{favoritesCount}</em>}
          </a>
          <button type="button" className="site-header__action" onClick={() => setCartOpen(true)} aria-label="Carrinho">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 6h15l-1.5 9H8L6 6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
              <circle cx="17" cy="19" r="1.5" fill="currentColor" />
            </svg>
            <span>Carrinho</span>
            {cartCount > 0 && <em className="site-header__badge">{cartCount}</em>}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
