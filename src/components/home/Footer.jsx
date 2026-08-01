import { Link } from 'react-router-dom'
import { footerHome } from '../../data/homeData'
import TerraEstiloLogo from './TerraEstiloLogo'

function socialHref(name) {
  if (name === 'Instagram') return footerHome.atendimento.instagramHref
  if (name === 'WhatsApp') return footerHome.atendimento.whatsappHref
  return `/contato`
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <TerraEstiloLogo variant="footer" />
          <p>{footerHome.description}</p>
          <div className="site-footer__social">
            {footerHome.social.map((name) => (
              <a
                key={name}
                href={socialHref(name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name === 'Instagram' ? footerHome.atendimento.instagram : name}
              </a>
            ))}
          </div>
        </div>

        <nav className="site-footer__col">
          <h4>Institucional</h4>
          <ul>
            {footerHome.institucional.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col">
          <h4>Atendimento</h4>
          <ul>
            <li>
              <a href={footerHome.atendimento.whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp: {footerHome.atendimento.whatsapp}
              </a>
            </li>
            <li>
              <a href={footerHome.atendimento.instagramHref} target="_blank" rel="noopener noreferrer">
                Instagram: {footerHome.atendimento.instagram}
              </a>
            </li>
            <li><a href={`mailto:${footerHome.atendimento.email}`}>{footerHome.atendimento.email}</a></li>
            <li><span>{footerHome.atendimento.hours}</span></li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Pagamento</h4>
          <div className="site-footer__payments">
            {footerHome.payments.map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} Terra & Estilo. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
