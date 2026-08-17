'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppNavLink from '../AppNavLink'
import { collectionsMegaMenu as collectionsMegaMenuFallback, footerHome, mainNavigation } from '../../data/homeData'
import { brandCollections } from '../../data/catalog'
import { useShop } from '../../context/ShopContext'

const { instagramHref, facebookHref } = footerHome.atendimento

function buildCollectionsMegaMenu(collections) {
  if (!Array.isArray(collections) || collections.length === 0) {
    return collectionsMegaMenuFallback
  }

  const fromDb = collections.slice(0, 6).map((c) => ({
    label: c.name || c.title,
    to: `/colecoes/${c.slug}`,
  }))

  return [
    ...fromDb,
    { label: 'Novidades', to: '/#novidades' },
    { label: 'Mais vendidos', to: '/#mais-vendidos' },
    { label: 'Ver todas as coleções', to: '/colecoes', isAll: true },
  ]
}

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

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h2.5l.5-3H14V9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MainNavigation({ open, onClose, onOpenCart }) {
  const pathname = usePathname() || ''
  const [hash, setHash] = useState('')
  const { cartCount, collections, categories } = useShop()
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const dropdownId = useId()
  const wrapRef = useRef(null)
  const closeTimerRef = useRef(null)
  const locationKey = `${pathname}${hash}`
  const [trackedLocation, setTrackedLocation] = useState(locationKey)

  const collectionsMegaMenu = useMemo(
    () => buildCollectionsMegaMenu(collections),
    [collections],
  )

  const featuredCollection = useMemo(() => {
    const fromDb =
      collections.find((c) => c.featured) || collections[0] || null
    if (fromDb) {
      const brand =
        brandCollections.find((c) => c.slug === fromDb.slug) || brandCollections[0]
      return {
        slug: fromDb.slug,
        title: fromDb.title || fromDb.name,
        image: fromDb.image || brand?.image,
        objectPosition: fromDb.objectPosition || brand?.objectPosition,
      }
    }
    return brandCollections.find((c) => c.slug === 'raizes-do-sul') || brandCollections[0]
  }, [collections])

  const navItems = useMemo(() => {
    const activeSlugs = new Set(
      (categories || [])
        .map((c) => String(c.slug || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        .filter(Boolean),
    )
    if (activeSlugs.size === 0) return mainNavigation
    return mainNavigation.filter((item) => {
      if (!item.to || item.to === '/colecoes' || item.to === '/sobre' || item.to === '/contato') {
        return true
      }
      const slug = String(item.to).replace(/^\//, '').toLowerCase()
      return activeSlugs.has(slug)
    })
  }, [categories])

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || '')
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  if (trackedLocation !== locationKey) {
    setTrackedLocation(locationKey)
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

  const toggleCollections = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setCollectionsOpen((v) => !v)
  }

  // Close mega menu only when the mobile drawer transitions closed
  // (not while desktop menuOpen stays false — that prevented the panel from opening).
  const prevOpenRef = useRef(open)
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setCollectionsOpen(false)
    }
    prevOpenRef.current = open
  }, [open])

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
                <AppNavLink
                  href={item.to}
                  end={Boolean(item.isAll) || item.to === '/colecoes'}
                  className={({ isActive }) => {
                    const hashIndex = item.to.indexOf('#')
                    const hashActive = hashIndex !== -1
                      && pathname === '/'
                      && hash === item.to.slice(hashIndex)
                    const active = hashActive || (isActive && hashIndex === -1)
                    return `main-nav__mega-link${item.isAll ? ' main-nav__mega-link--all' : ''}${active ? ' is-active' : ''}`
                  }}
                  onClick={handleNavClick}
                >
                  {item.label}
                </AppNavLink>
              </li>
            ))}
          </ul>
        </div>
        {featuredCollection && (
          <Link
            href={`/colecoes/${featuredCollection.slug}`}
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
        {navItems.map((item, index) => {
          const showOrnamentBefore = item.label === 'Sobre'
          const prevIsCollections = navItems[index - 1]?.hasDropdown
          const mid = Math.ceil(navItems.length / 2)
          const insertCenterSlot = index === mid

          const ornament = showOrnamentBefore && prevIsCollections
            ? <LeafOrnament key="nav-ornament" />
            : null

          const centerSlot = insertCenterSlot
            ? <span key="nav-center-slot" className="main-nav__center-slot" aria-hidden="true" />
            : null

          if (item.hasDropdown) {
            const isCollectionsActive = pathname.startsWith('/colecoes')
            return (
              <div key={item.label} className="main-nav__cluster">
                {centerSlot}
                <div
                  className={`main-nav__item main-nav__item--dropdown${collectionsOpen ? ' is-open' : ''}`}
                  ref={wrapRef}
                  onMouseEnter={handleDesktopEnter}
                  onMouseLeave={scheduleCloseCollections}
                >
                  <div className="main-nav__link-wrap">
                    <AppNavLink
                      href={item.to}
                      end
                      className={() =>
                        `main-nav__link main-nav__link--chevron${isCollectionsActive || collectionsOpen ? ' is-active' : ''}`
                      }
                      aria-current={isCollectionsActive ? 'page' : undefined}
                      onClick={handleNavClick}
                    >
                      <span>{item.label}</span>
                    </AppNavLink>
                    <button
                      type="button"
                      className={`main-nav__chevron-btn${collectionsOpen ? ' is-open' : ''}`}
                      aria-expanded={collectionsOpen}
                      aria-controls={dropdownId}
                      aria-haspopup="true"
                      aria-label={collectionsOpen ? 'Fechar menu de coleções' : 'Abrir menu de coleções'}
                      onClick={toggleCollections}
                    >
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
                  </div>

                  {renderMegaPanel()}
                </div>
              </div>
            )
          }

          return (
            <div key={item.label} className="main-nav__cluster">
              {centerSlot}
              {ornament}
              <AppNavLink
                href={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `main-nav__link${isActive ? ' is-active' : ''}`
                }
                onClick={handleNavClick}
              >
                {item.label}
              </AppNavLink>
            </div>
          )
        })}
      </div>

      <div className="main-nav__drawer-actions">
        <a
          href={instagramHref}
          className="main-nav__drawer-action main-nav__drawer-action--social"
          aria-label="Instagram Terra & Estilo"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleNavClick}
        >
          <InstagramIcon />
          Instagram
        </a>
        <a
          href={facebookHref}
          className="main-nav__drawer-action main-nav__drawer-action--social"
          aria-label="Facebook Terra & Estilo"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleNavClick}
        >
          <FacebookIcon />
          Facebook
        </a>
        <button
          type="button"
          className="main-nav__drawer-action"
          aria-label={`Sacola${cartCount > 0 ? `, ${cartCount} itens` : ''}`}
          onClick={() => onOpenCart?.()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Sacola
          <em className="site-header__badge">{cartCount}</em>
        </button>
      </div>
    </nav>
  )
}

export default MainNavigation
