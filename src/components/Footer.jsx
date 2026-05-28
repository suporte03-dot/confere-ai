import Logo from './Logo'
import { footerLinks } from '../data/mockData'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#inicio" className="footer__logo">
            <Logo variant="footer" />
          </a>
          <p className="footer__tagline">
            Conferência inteligente para arquivos fiscais, contábeis e financeiros.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Links do rodapé">
          <p className="footer__nav-title">Navegação</p>
          <ul className="footer__links">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__legal">
          <p className="footer__copy">
            © {new Date().getFullYear()} ConfereAI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
