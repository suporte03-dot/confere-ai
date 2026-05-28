import { navLinks } from '../data/mockData'

function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#inicio" className="logo">
          <span className="logo__icon">C</span>
          <span className="logo__text">ConfereAI</span>
        </a>

        <nav className="nav" aria-label="Navegação principal">
          <ul className="nav__list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#upload" className="btn btn--primary btn--sm header__cta">
          Começar análise
        </a>
      </div>
    </header>
  )
}

export default Header
