import Logo from './Logo'
import { footerLinks, paymentMethods } from '../data/mockData'

function Footer() {
  return (
    <footer id="sobre" className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>
            TerraBrasil é moda casual premium com raízes brasileiras — qualidade, conforto
            e estilo para homens, mulheres e crianças.
          </p>
          <div className="footer__social">
            {['Instagram', 'Facebook', 'YouTube'].map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`}>{s}</a>
            ))}
          </div>
        </div>

        <nav className="footer__col">
          <h4>Institucional</h4>
          <ul>
            {footerLinks.institucional.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col">
          <h4>Categorias</h4>
          <ul>
            {footerLinks.categorias.map((l) => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="footer__col" id="atendimento">
          <h4>Pagamento</h4>
          <div className="footer__payments">
            {paymentMethods.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <p className="footer__copy">© {new Date().getFullYear()} TerraBrasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
