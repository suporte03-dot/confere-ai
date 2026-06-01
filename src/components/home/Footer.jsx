import { footerHome } from '../../data/homeData'
import TerraEstiloLogo from './TerraEstiloLogo'

function Footer() {
  return (
    <footer id="contato" className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <TerraEstiloLogo variant="footer" />
          <p>{footerHome.description}</p>
          <div className="site-footer__social">
            {footerHome.social.map((name) => (
              <a key={name} href={`#${name.toLowerCase()}`}>{name}</a>
            ))}
          </div>
        </div>

        <nav className="site-footer__col">
          <h4>Institucional</h4>
          <ul>
            {footerHome.institucional.map((link) => (
              <li key={link.label}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col" id="lojas">
          <h4>Atendimento</h4>
          <ul>
            <li><a href={`https://wa.me/5551999990000`}>WhatsApp: {footerHome.atendimento.whatsapp}</a></li>
            <li><a href={`mailto:${footerHome.atendimento.email}`}>{footerHome.atendimento.email}</a></li>
            <li><span>{footerHome.atendimento.hours}</span></li>
          </ul>
        </div>

        <div className="site-footer__col" id="trocas">
          <h4>Pagamento</h4>
          <div className="site-footer__payments">
            {footerHome.payments.map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} TerraEstilo. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
