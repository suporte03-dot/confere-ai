import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { collectionsMegaMenu, mainNavigation } from '../../data/homeData'
import { brandCollections } from '../../data/catalog'
import { useShop } from '../../context/ShopContext'

const featuredCollection = brandCollections.find((c) => c.slug === 'raizes-do-sul')
  || brandCollections[0]

function isDesktopNav() {
  return typeof window !== 'undefined'
    && window.matchMedia('(min-width: 1101px)').matches
}

function LeafOrnament() {
  return (
    <span className="main-nav__ornament" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3c-1.8 3.2-6 5.4-6 10.2A6 6 0 0 0 12 19a6 6 0 0 0 6-5.8C18 8.4 13.8 6.2 12 3Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <path
          d="M12 19V9.5"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function MainNavigation({ open, onClose, onAccountClick, onOpenCart }) {
  const location = useLocation()
  const { favoritesCount, cartCount } = useShop()
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const dropdownId = useId()
  const wrapRef = useRef(null)
  const closeTimerRef = useRef(null)
  const locationKey = `${location.pathname}${location.hash}`
  const [trackedLocation, setTrackedLocation] = useState(locationKey)

  if (trackedLocation !== locationKey) {
    setTrackedLocation(locationKey)
    setCollectionsOpen(false)
  }

  if (!open && collectionsOpen) {
    setCollectionsOpen(false)
  }

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openCollections = () => {
    clearCloseTimer()
    setCollectionsOpen(true)
  }

  const scheduleCloseCollections = () => {
    if (!isDesktopNav()) return
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setCollectionsOpen(false)
    }, 160)
  }

  const handleDesktopEnter = () => {
    if (isDesktopNav()) openCollections()
  }

  useEffect(() => {
    if (!collectionsOpen) return undefined

    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setCollectionsOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCollectionsOpen(false)
        const trigger = wrapRef.current?.querySelector('[aria-haspopup="true"]')
        trigger?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [collectionsOpen])

  useEffect(() => () => clearCloseTimer(), [])

  const handleNavClick = () => {
    setCollectionsOpen(false)
    onClose?.()
  }

  const renderMegaPanel = () => (
    <div
      id={dropdownId}
      className={`main-nav__mega${collectionsOpen ? ' is-open' : ''}`}
      role="region"
      aria-label="Coleções"
      hidden={!collectionsOpen}
      onMouseEnter={handleDesktopEnter}
      onMouseLeave={scheduleCloseCollections}
    >
      <div className="main-nav__mega-grid">
        <div className="main-nav__mega-links">
          <p className="main-nav__mega-label">Coleções</p>
          <ul>
            {collectionsMegaMenu.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={Boolean(item.isAll) || item.to === '/colecoes'}
                  className={({ isActive }) => {
                    const hashIndex = item.to.indexOf('#')
                    const hashActive = hashIndex !== -1
                      && location.pathname === '/'
                      && location.hash === item.to.slice(hashIndex)
                    const active = hashActive || (isActive && hashIndex === -1)
                    return `main-nav__mega-link${item.isAll ? ' main-nav__mega-link--all' : ''}${active ? ' is-active' : ''}`
                  }}
                  onClick={handleNavClick}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {featuredCollection && (
          <Link
            to={`/colecoes/${featuredCollection.slug}`}
            className="main-nav__mega-feature"
            onClick={handleNavClick}
          >
            <img
              src={featuredCollection.image}
              alt=""
              style={{ objectPosition: featuredCollection.objectPosition || 'center' }}
              loading="lazy"
              decoding="async"
            />
            <span className="main-nav__mega-feature-copy">
              <em>Em destaque</em>
              <strong>{featuredCollection.title}</strong>
            </span>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <nav
      id="site-main-nav"
      className={`main-nav ${open ? 'main-nav--open' : ''}`}
      aria-label="Principal"
    >
      <div className="main-nav__drawer-head">
        <p className="main-nav__drawer-brand">Terra &amp; Estilo</p>
        <button
          type="button"
          className="main-nav__drawer-close"
          aria-label="Fechar menu"
          onClick={() => onClose?.()}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="main-nav__inner">
        {mainNavigation.map((item, index) => {
          const showOrnamentBefore = item.label === 'Sobre'
          const prevIsCollections = mainNavigation[index - 1]?.hasDropdown

          const ornament = showOrnamentBefore && prevIsCollections
            ? <LeafOrnament key="nav-ornament" />
            : null

          if (item.hasDropdown) {
            const isCollectionsActive = location.pathname.startsWith('/colecoes')
            return (
              <div key={item.label} className="main-nav__cluster">
                <div
                  className={`main-nav__item main-nav__item--dropdown${collectionsOpen ? ' is-open' : ''}`}
                  ref={wrapRef}
                  onMouseEnter={handleDesktopEnter}
                  onMouseLeave={scheduleCloseCollections}
                >
                  <button
                    type="button"
                    className={`main-nav__link main-nav__link--chevron${isCollectionsActive || collectionsOpen ? ' is-active' : ''}`}
                    aria-expanded={collectionsOpen}
                    aria-controls={dropdownId}
                    aria-haspopup="true"
                    aria-current={isCollectionsActive ? 'page' : undefined}
                    onClick={() => setCollectionsOpen((v) => !v)}
                  >
                    <span>{item.label}</span>
                    <svg
                      className="main-nav__chevron"
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 4.5 6 8l3.5-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {renderMegaPanel()}
                </div>
              </div>
            )
          }

          return (
            <div key={item.label} className="main-nav__cluster">
              {ornament}
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `main-nav__link${isActive ? ' is-active' : ''}`
                }
                onClick={handleNavClick}
              >
                {item.label}
              </NavLink>
            </div>
          )
        })}
      </div>

      <div className="main-nav__drawer-actions">
        <button
          type="button"
          className="main-nav__drawer-action"
          aria-label="Minha conta"
          onClick={(event) => {
            onAccountClick?.(event)
            onClose?.()
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Minha conta
        </button>
        <Link
          to="/#favoritos"
          className="main-nav__drawer-action"
          aria-label="Favoritos"
          onClick={handleNavClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20s-6.5-4.2-8.8-8A4.8 4.8 0 0 1 12 6.2 4.8 4.8 0 0 1 20.8 12c-2.3 3.8-8.8 8-8.8 8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Favoritos
          {favoritesCount > 0 && <em className="site-header__badge">{favoritesCount}</em>}
        </Link>
        <button
          type="button"
          className="main-nav__drawer-action"
          aria-label={`Sacola${cartCount > 0 ? `, ${cartCount} itens` : ''}`}
          onClick={() => onOpenCart?.()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          Sacola
          <em className="site-header__badge">{cartCount}</em>
        </button>
      </div>
    </nav>
  )
}

export default MainNavigation
