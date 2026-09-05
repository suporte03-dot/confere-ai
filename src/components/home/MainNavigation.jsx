'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppNavLink from '../AppNavLink'
import { collectionsMegaMenu as collectionsMegaMenuFallback, footerHome } from '../../data/homeData'
import { brandCollections } from '../../data/catalog'
import { buildPublicCategoryNav } from '../../lib/catalog/category-nav'
import { useShop } from '../../context/ShopContext'

const { instagramHref, facebookHref } = footerHome.atendimento

const STATIC_TAIL_NAV = [
  { label: 'Coleções', to: '/colecoes', hasDropdown: true, hasChevron: true },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
]

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

function ChevronIcon() {
  return (
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
  )
}

function MainNavigation({ open, onClose, onOpenCart }) {
  const pathname = usePathname() || ''
  const [hash, setHash] = useState('')
  const { cartCount, collections, categories } = useShop()
  const [openMenuKey, setOpenMenuKey] = useState(null)
  const dropdownId = useId()
  const wrapRefs = useRef({})
  const closeTimerRef = useRef(null)
  const locationKey = `${pathname}${hash}`
  const [trackedLocation, setTrackedLocation] = useState(locationKey)

  const categoryNav = useMemo(
    () => buildPublicCategoryNav(categories),
    [categories],
  )

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
    const fromCategories = categoryNav.map((item) => ({
      key: `cat-${item.id}`,
      label: item.name,
      to: item.href,
      hasDropdown: item.children.length > 0,
      children: item.children,
      kind: 'category',
    }))

    const tail = STATIC_TAIL_NAV.map((item) => ({
      ...item,
      key: `static-${item.to}`,
      kind: item.hasDropdown ? 'collections' : 'link',
      children: [],
    }))

    return [...fromCategories, ...tail]
  }, [categoryNav])

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || '')
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  if (trackedLocation !== locationKey) {
    setTrackedLocation(locationKey)
    setOpenMenuKey(null)
  }

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openMenu = (key) => {
    clearCloseTimer()
    setOpenMenuKey(key)
  }

  const scheduleCloseMenu = () => {
    if (!isDesktopNav()) return
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenuKey(null)
    }, 160)
  }

  const handleDesktopEnter = (key) => {
    if (isDesktopNav()) openMenu(key)
  }

  const toggleMenu = (event, key) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenMenuKey((current) => (current === key ? null : key))
  }

  const prevOpenRef = useRef(open)
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setOpenMenuKey(null)
    }
    prevOpenRef.current = open
  }, [open])

  useEffect(() => {
    if (!openMenuKey) return undefined

    const onPointerDown = (event) => {
      const wrap = wrapRefs.current[openMenuKey]
      if (!wrap?.contains(event.target)) {
        setOpenMenuKey(null)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenuKey(null)
        const wrap = wrapRefs.current[openMenuKey]
        const trigger = wrap?.querySelector('[aria-haspopup="true"]')
        trigger?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenuKey])

  useEffect(() => () => clearCloseTimer(), [])

  const handleNavClick = () => {
    setOpenMenuKey(null)
    onClose?.()
  }

  const renderCategoryPanel = (item, isOpen) => (
    <div
      id={`${dropdownId}-${item.key}`}
      className={`main-nav__mega main-nav__mega--category${isOpen ? ' is-open' : ''}`}
      role="region"
      aria-label={item.label}
      hidden={!isOpen}
      onMouseEnter={() => handleDesktopEnter(item.key)}
      onMouseLeave={scheduleCloseMenu}
    >
      <div className="main-nav__mega-grid main-nav__mega-grid--simple">
        <div className="main-nav__mega-links">
          <p className="main-nav__mega-label">{item.label}</p>
          <ul>
            <li>
              <AppNavLink
                href={item.to}
                end
                className={({ isActive }) =>
                  `main-nav__mega-link main-nav__mega-link--all${isActive ? ' is-active' : ''}`
                }
                onClick={handleNavClick}
              >
                Ver tudo
              </AppNavLink>
            </li>
            {item.children.map((child) => (
              <li key={child.id}>
                <AppNavLink
                  href={child.href}
                  className={({ isActive }) =>
                    `main-nav__mega-link${isActive ? ' is-active' : ''}`
                  }
                  onClick={handleNavClick}
                >
                  {child.name}
                </AppNavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  const renderCollectionsPanel = (isOpen) => (
    <div
      id={`${dropdownId}-collections`}
      className={`main-nav__mega${isOpen ? ' is-open' : ''}`}
      role="region"
      aria-label="Coleções"
      hidden={!isOpen}
      onMouseEnter={() => handleDesktopEnter('collections')}
      onMouseLeave={scheduleCloseMenu}
    >
      <div className="main-nav__mega-grid">
        <div className="main-nav__mega-links">
          <p className="main-nav__mega-label">Coleções</p>
          <ul>
            {collectionsMegaMenu.map((entry) => (
              <li key={entry.label}>
                <AppNavLink
                  href={entry.to}
                  end={Boolean(entry.isAll) || entry.to === '/colecoes'}
                  className={({ isActive }) => {
                    const hashIndex = entry.to.indexOf('#')
                    const hashActive = hashIndex !== -1
                      && pathname === '/'
                      && hash === entry.to.slice(hashIndex)
                    const active = hashActive || (isActive && hashIndex === -1)
                    return `main-nav__mega-link${entry.isAll ? ' main-nav__mega-link--all' : ''}${active ? ' is-active' : ''}`
                  }}
                  onClick={handleNavClick}
                >
                  {entry.label}
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
          const prevIsDropdown = Boolean(navItems[index - 1]?.hasDropdown)
          const mid = Math.ceil(navItems.length / 2)
          const insertCenterSlot = index === mid
          const menuKey = item.kind === 'collections' ? 'collections' : item.key
          const isOpen = openMenuKey === menuKey

          const ornament = showOrnamentBefore && prevIsDropdown
            ? <LeafOrnament key="nav-ornament" />
            : null

          const centerSlot = insertCenterSlot
            ? <span key="nav-center-slot" className="main-nav__center-slot" aria-hidden="true" />
            : null

          if (item.hasDropdown) {
            const isRouteActive =
              item.kind === 'collections'
                ? pathname.startsWith('/colecoes')
                : pathname === item.to || pathname.startsWith(`${item.to}/`)

            return (
              <div key={item.key} className="main-nav__cluster">
                {centerSlot}
                <div
                  className={`main-nav__item main-nav__item--dropdown${isOpen ? ' is-open' : ''}`}
                  ref={(node) => {
                    if (node) wrapRefs.current[menuKey] = node
                  }}
                  onMouseEnter={() => handleDesktopEnter(menuKey)}
                  onMouseLeave={scheduleCloseMenu}
                >
                  <div className="main-nav__link-wrap">
                    <AppNavLink
                      href={item.to}
                      end
                      className={() =>
                        `main-nav__link main-nav__link--chevron${isRouteActive || isOpen ? ' is-active' : ''}`
                      }
                      aria-current={isRouteActive ? 'page' : undefined}
                      onClick={handleNavClick}
                    >
                      <span>{item.label}</span>
                    </AppNavLink>
                    <button
                      type="button"
                      className={`main-nav__chevron-btn${isOpen ? ' is-open' : ''}`}
                      aria-expanded={isOpen}
                      aria-controls={
                        item.kind === 'collections'
                          ? `${dropdownId}-collections`
                          : `${dropdownId}-${item.key}`
                      }
                      aria-haspopup="true"
                      aria-label={
                        isOpen
                          ? `Fechar menu de ${item.label}`
                          : `Abrir menu de ${item.label}`
                      }
                      onClick={(event) => toggleMenu(event, menuKey)}
                    >
                      <ChevronIcon />
                    </button>
                  </div>

                  {item.kind === 'collections'
                    ? renderCollectionsPanel(isOpen)
                    : renderCategoryPanel(item, isOpen)}
                </div>
              </div>
            )
          }

          return (
            <div key={item.key} className="main-nav__cluster">
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
