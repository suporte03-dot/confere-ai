import { Link } from 'react-router-dom'
import { footerHome } from '../../data/homeData'
import santaNova from '../../assets/santa-nova-hero.png'
import TerraEstiloLogo from './TerraEstiloLogo'

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.36 12.75L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.1c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.1-.1.3 0 .4.3.5.8 1 1.3 1.3.2.1.3.1.4 0l.5-.4c.2-.1.4-.2.5-.1l1.7.7c.3.1.4.3.4.5v.5c0 .2 0 .4-.4.6-.4.2-1 .3-1.6.1-1.5-.4-2.9-1.5-3.9-2.9-.8-1.1-1.2-2.3-1.1-3.4 0-.5.1-1 .4-1.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 7.5 12 13l7.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 8.5V12l2.8 2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function LogoVisa() {
  return (
    <svg viewBox="0 7.5 24 9" width="42" height="16" aria-hidden="true" focusable="false">
      <path
        fill="#1A1F71"
        d="M9.112 8.262 5.97 15.738H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 0 1 .894.764l.817 4.338 2.956-5.102zm8.063.027c-.805-.027-1.478.15-1.854.52-.376.369-.544.876-.472 1.568.14 1.33 1.264 2.115 3.03 2.115.805 0 1.54-.166 1.854-.369l.282 1.308c-.376.203-1.22.422-2.058.422-3.03 0-4.872-1.568-4.995-3.727-.084-1.308.706-2.392 2.15-2.94.706-.273 1.666-.422 2.58-.45.875-.028 1.385.082 1.83.246l-.35 1.623c-.455-.164-1.02-.273-1.997-.316zm5.347-.027 1.666 7.476h-1.854l-.282-1.308h-2.58l-.45 1.308h-2.058l2.58-7.476zm-1.22 2.173-.845 2.447h1.83zM11.918 8.262l-1.666 7.476H8.452l1.666-7.476z"
      />
    </svg>
  )
}

function LogoMastercard() {
  return (
    <svg viewBox="0 0 38 24" width="38" height="24" aria-hidden="true" focusable="false">
      <circle cx="14" cy="12" r="10" fill="#EB001B" />
      <circle cx="24" cy="12" r="10" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M19 4.35a9.98 9.98 0 0 0-5 8.65 9.98 9.98 0 0 0 5 8.65 9.98 9.98 0 0 0 5-8.65 9.98 9.98 0 0 0-5-8.65z"
      />
    </svg>
  )
}

function LogoPix() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        fill="#32BCAD"
        d="M17.45 6.05A3.55 3.55 0 0 0 14.95 5H13.9l3.35 3.35a.9.9 0 0 1 0 1.27L11.5 15.37a.9.9 0 0 1-1.27 0L6.88 12H5.95c0 1.05.42 2.05 1.17 2.8l4.35 4.35A3.55 3.55 0 0 0 14 20.3a3.55 3.55 0 0 0 2.52-1.05l4.35-4.35A3.55 3.55 0 0 0 22 12.55a3.55 3.55 0 0 0-1.05-2.52l-3.5-3.98z"
      />
      <path
        fill="#32BCAD"
        d="M11.5 9.55a.9.9 0 0 1 1.27 0L16.12 13h1.05c0-1.05-.42-2.05-1.17-2.8L11.65 5.85A3.55 3.55 0 0 0 9.13 4.8 3.55 3.55 0 0 0 6.6 5.85L2.25 10.2A3.55 3.55 0 0 0 1.2 12.72c0 .95.38 1.85 1.05 2.52l3.5 3.98c.75.75 1.75 1.17 2.8 1.17h.93L6.13 17.04a.9.9 0 0 1 0-1.27L11.5 9.55z"
      />
    </svg>
  )
}

function LogoElo() {
  return (
    <svg viewBox="0 0 52 20" width="46" height="18" aria-hidden="true" focusable="false">
      <circle cx="9" cy="10" r="7" fill="#FFCB05" />
      <circle cx="9" cy="10" r="3.4" fill="#000" />
      <path
        fill="#000"
        d="M21.1 5.1c-2.85 0-4.95 2-4.95 5s2.1 5 4.95 5c1.55 0 2.85-.55 3.7-1.6l-1.65-1.4c-.5.55-1.15.9-2 .9-1.3 0-2.25-.95-2.25-2.9s.95-2.9 2.25-2.9c.85 0 1.5.35 2 .9l1.65-1.4c-.85-1.05-2.15-1.6-3.7-1.6zm8.85 0c-2.7 0-4.8 2.05-4.8 5s2.1 5 4.8 5 4.8-2.05 4.8-5-2.1-5-4.8-5zm0 2.1c1.3 0 2.25 1 2.25 2.9s-.95 2.9-2.25 2.9-2.25-1-2.25-2.9.95-2.9 2.25-2.9zM37.1 14.9h2.45V5.3H37.1v9.6zm4.55-4.8c0 2.85 1.95 5 4.8 5 1.4 0 2.55-.45 3.45-1.4l-1.55-1.5c-.45.5-1.1.85-1.85.85-1.25 0-2.2-1-2.25-2.95h6c.05-.3.05-.55.05-.9 0-2.65-1.85-4.5-4.55-4.5-2.7 0-4.8 2-4.8 5zm2.45-1.2c.2-1.15 1-1.95 2.2-1.95 1.15 0 1.85.75 1.95 1.95h-4.15z"
      />
    </svg>
  )
}

const paymentLogos = {
  Visa: LogoVisa,
  Mastercard: LogoMastercard,
  Pix: LogoPix,
  Elo: LogoElo,
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__ornament" aria-hidden="true">
        <span className="site-footer__ornament-line" />
        <img
          src={santaNova}
          alt=""
          className="site-footer__santa"
          decoding="async"
        />
        <span className="site-footer__ornament-line" />
      </div>

      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <TerraEstiloLogo variant="footer" />
          <p>{footerHome.description}</p>
          <div className="site-footer__social">
            <a
              href={footerHome.atendimento.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footerHome.atendimento.instagram}
            </a>
            <a
              href={footerHome.atendimento.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <nav className="site-footer__col" aria-label="Institucional">
          <h4>Institucional</h4>
          <ul>
            {footerHome.institucional.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__col site-footer__col--atendimento">
          <h4>Atendimento</h4>
          <ul>
            <li>
              <span className="site-footer__icon" aria-hidden="true"><IconWhatsApp /></span>
              <a href={footerHome.atendimento.whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp: {footerHome.atendimento.whatsapp}
              </a>
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true"><IconInstagram /></span>
              <a href={footerHome.atendimento.instagramHref} target="_blank" rel="noopener noreferrer">
                Instagram: {footerHome.atendimento.instagram}
              </a>
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true"><IconEmail /></span>
              <a href={`mailto:${footerHome.atendimento.email}`}>{footerHome.atendimento.email}</a>
            </li>
            <li>
              <span className="site-footer__icon" aria-hidden="true"><IconClock /></span>
              <span>{footerHome.atendimento.hours}</span>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Pagamento</h4>
          <div className="site-footer__payments" role="list">
            {footerHome.payments.map((method) => {
              const Logo = paymentLogos[method]
              return (
                <span
                  key={method}
                  className="site-footer__payment"
                  role="listitem"
                  title={method}
                  aria-label={method}
                >
                  {Logo ? <Logo /> : method}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {year} Terra & Estilo. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
