import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { mainNavigation } from '../../data/homeData'
import { brandCollections } from '../../data/catalog'

function MainNavigation({ open, onClose }) {
  const location = useLocation()
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const dropdownId = useId()
  const wrapRef = useRef(null)

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

  const handleNavClick = () => {
    setCollectionsOpen(false)
    onClose?.()
  }

  return (
    <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Principal">
      <div className="main-nav__inner">
        {mainNavigation.map((item) => {
          if (item.hasDropdown) {
            const isCollectionsActive = location.pathname.startsWith('/colecoes')
            return (
              <div
                key={item.label}
                className={`main-nav__item main-nav__item--dropdown${collectionsOpen ? ' is-open' : ''}`}
                ref={wrapRef}
              >
                <button
                  type="button"
                  className={`main-nav__link main-nav__link--chevron${isCollectionsActive ? ' is-active' : ''}`}
                  aria-expanded={collectionsOpen}
                  aria-controls={dropdownId}
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

                <div
                  id={dropdownId}
                  className={`main-nav__dropdown${collectionsOpen ? ' is-open' : ''}`}
                  hidden={!collectionsOpen}
                >
                  <p className="main-nav__dropdown-label">Coleções</p>
                  <ul>
                    {brandCollections.map((collection) => (
                      <li key={collection.slug}>
                        <NavLink
                          to={`/colecoes/${collection.slug}`}
                          className={({ isActive }) =>
                            `main-nav__dropdown-link${isActive ? ' is-active' : ''}`
                          }
                          onClick={handleNavClick}
                        >
                          {collection.title}
                        </NavLink>
                      </li>
                    ))}
                    <li>
                      <NavLink
                        to="/colecoes"
                        end
                        className={({ isActive }) =>
                          `main-nav__dropdown-link main-nav__dropdown-link--all${isActive ? ' is-active' : ''}`
                        }
                        onClick={handleNavClick}
                      >
                        Ver todas
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `main-nav__link${isActive ? ' is-active' : ''}`
              }
              onClick={handleNavClick}
            >
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MainNavigation
