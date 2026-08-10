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

const VISA_BLUE = '#1A1F71'
const MC_RED = '#EB001B'
const MC_ORANGE = '#F79E1B'
const MC_OVERLAP = '#FF5F00'
const PIX_TEAL = '#32BCAD'
const ELO_YELLOW = '#FFCB05'
const ELO_BLACK = '#000000'

/** Recognizable brand marks — optical scale in CSS (.site-footer__payment--*). */
function LogoVisa() {
  /* Classic Visa wordmark (name is the logo) — viewBox cropped for strip scale */
  return (
    <svg viewBox="0 7.8 24 8.5" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <path
        fill={VISA_BLUE}
        d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"
      />
    </svg>
  )
}

function LogoMastercard() {
  return (
    <svg viewBox="0 0 40 24" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <circle cx="15.2" cy="12" r="9.2" fill={MC_RED} />
      <circle cx="24.8" cy="12" r="9.2" fill={MC_ORANGE} />
      <path
        fill={MC_OVERLAP}
        d="M20 4.35a9.15 9.15 0 0 0-3.95 7.65A9.15 9.15 0 0 0 20 19.65a9.15 9.15 0 0 0 3.95-7.65A9.15 9.15 0 0 0 20 4.35z"
      />
    </svg>
  )
}

function LogoPix() {
  /* Official Pix geometric mark (Banco Central / Simple Icons) */
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <path
        fill={PIX_TEAL}
        d="M5.283 18.36a3.505 3.505 0 0 0 2.493-1.032l3.6-3.6a.684.684 0 0 1 .946 0l3.613 3.613a3.504 3.504 0 0 0 2.493 1.032h.71l-4.56 4.56a3.647 3.647 0 0 1-5.156 0L4.85 18.36ZM18.428 5.627a3.505 3.505 0 0 0-2.493 1.032l-3.613 3.614a.67.67 0 0 1-.946 0l-3.6-3.6A3.505 3.505 0 0 0 5.283 5.64h-.434l4.573-4.572a3.646 3.646 0 0 1 5.156 0l4.559 4.559ZM1.068 9.422 3.79 6.699h1.492a2.483 2.483 0 0 1 1.744.722l3.6 3.6a1.73 1.73 0 0 0 2.443 0l3.614-3.613a2.482 2.482 0 0 1 1.744-.723h1.767l2.737 2.737a3.646 3.646 0 0 1 0 5.156l-2.736 2.736h-1.768a2.482 2.482 0 0 1-1.744-.722l-3.613-3.613a1.77 1.77 0 0 0-2.444 0l-3.6 3.6a2.483 2.483 0 0 1-1.744.722H3.791l-2.723-2.723a3.646 3.646 0 0 1 0-5.156"
      />
    </svg>
  )
}

function LogoElo() {
  /* Elo wordmark on yellow — standard Brazilian payment-strip look */
  return (
    <svg viewBox="0 0 48 28" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <rect x="1" y="2" width="46" height="24" rx="5" fill={ELO_YELLOW} />
      <text
        x="24"
        y="19"
        textAnchor="middle"
        fill={ELO_BLACK}
        fontFamily="Arial Rounded MT Bold, Arial Black, Arial, Helvetica, sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="-0.03em"
      >
        elo
      </text>
    </svg>
  )
}

const paymentLogos = {
  Visa: { Logo: LogoVisa, label: null },
  Mastercard: { Logo: LogoMastercard, label: 'Mastercard' },
  Pix: { Logo: LogoPix, label: 'Pix' },
  Elo: { Logo: LogoElo, label: null },
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

        <div className="site-footer__col site-footer__col--pagamento">
          <h4>Pagamento</h4>
          <div className="site-footer__payments" role="list">
            {footerHome.payments.map((method) => {
              const entry = paymentLogos[method]
              const slug = method.toLowerCase()
              const Logo = entry?.Logo
              const label = entry?.label
              return (
                <span
                  key={method}
                  className={`site-footer__payment site-footer__payment--${slug}`}
                  role="listitem"
                  title={method}
                  aria-label={method}
                >
                  <span className="site-footer__payment-mark">
                    {Logo ? <Logo /> : null}
                  </span>
                  {label ? (
                    <span className="site-footer__payment-name">{label}</span>
                  ) : null}
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
