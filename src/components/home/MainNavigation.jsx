import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { collectionsMegaMenu, mainNavigation } from '../../data/homeData'
import { brandCollections } from '../../data/catalog'

const featuredCollection = brandCollections.find((c) => c.slug === 'raizes-do-sul')
  || brandCollections[0]

function isDesktopNav() {
  return typeof window !== 'undefined'
    && window.matchMedia('(min-width: 1025px)').matches
}

function LeafOrnament() {
  return (
    <span className="main-nav__ornament" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function MainNavigation({ open, onClose }) {
  const location = useLocation()
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const dropdownId = useId()
  const wrapRef = useRef(null)
  const closeTimerRef = useRef(null)

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
    setCollectionsOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!open) setCollectionsOpen(false)
  }, [open])

  useEffect(() => {
    if (!collectionsOpen) return undefined

    const onPointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) {
        setCollectionsOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCollectionsOpen(false)
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
    <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Principal">
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
                    className={`main-nav__link main-nav__link--chevron${isCollectionsActive ? ' is-active' : ''}`}
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
    </nav>
  )
}

export default MainNavigation
