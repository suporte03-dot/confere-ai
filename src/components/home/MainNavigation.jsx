import { mainNavigation } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'

function MainNavigation({ open, onClose }) {
  const { navigateToCollection } = useShop()

  const handleClick = (item, e) => {
    if (item.filter) {
      e.preventDefault()
      navigateToCollection(item.filter)
    }
    onClose?.()
  }

  return (
    <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Principal">
      <div className="main-nav__inner">
        {mainNavigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`main-nav__link${item.hasChevron ? ' main-nav__link--chevron' : ''}`}
            onClick={(e) => handleClick(item, e)}
          >
            <span>{item.label}</span>
            {item.hasChevron && (
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
            )}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default MainNavigation
