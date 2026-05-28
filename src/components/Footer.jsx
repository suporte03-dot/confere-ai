import Logo from './Logo'
import { footerLinks } from '../data/mockData'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href="#inicio" className="footer__logo">
            <Logo variant="full" size="sm" tone="light" />
          </a>
          <p className="footer__tagline">
            Conferência inteligente para arquivos fiscais, contábeis e financeiros.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Links do rodapé">
          <p className="footer__nav-title">Produto</p>
          <ul className="footer__links">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__meta">
          <p className="footer__copy">
            © {new Date().getFullYear()} ConfereAI. Todos os direitos reservados.
          </p>
          <p className="footer__note">Software de auditoria e conferência documental.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
