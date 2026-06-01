import { mainNavigation } from '../../data/homeData'
import { useShop } from '../../context/ShopContext'

function MainNavigation({ open, onClose }) {
  const { navigateToCollection } = useShop()

  const handleClick = (item, e) => {
    if (item.filter) {
      e.preventDefault()
      navigateToCollection(item.filter)
    }
    onClose()
  }

  return (
    <nav className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Principal">
      <div className="main-nav__inner site-chrome__panel">
        {mainNavigation.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="main-nav__link"
            onClick={(e) => handleClick(item, e)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default MainNavigation
