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

const PAY_GOLD = '#c99b32'
const PAY_GOLD_MID = '#d4a84a'
const PAY_GOLD_SOFT = '#dfbd69'
const PAY_DARK = '#1f1a14'

/** Brand marks only — optical scale tuned in CSS (.site-footer__payment--*). */
function LogoVisa() {
  return (
    <svg viewBox="0 0 48 28" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(0 0.5)">
        <text
          x="24"
          y="15.2"
          textAnchor="middle"
          fill={PAY_DARK}
          fontFamily="Arial Narrow, Arial, Helvetica, sans-serif"
          fontSize="14.5"
          fontWeight="800"
          fontStyle="italic"
          letterSpacing="0.12em"
        >
          VISA
        </text>
        <rect x="8.5" y="19.2" width="31" height="1.7" rx="0.85" fill={PAY_GOLD} />
      </g>
    </svg>
  )
}

function LogoMastercard() {
  return (
    <svg viewBox="0 0 48 28" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <circle cx="18.4" cy="14" r="8.8" fill={PAY_GOLD} />
      <circle cx="29.6" cy="14" r="8.8" fill={PAY_GOLD_MID} fillOpacity="0.92" />
      <path
        fill={PAY_GOLD_SOFT}
        d="M24 5.8a8.75 8.75 0 0 0-4.4 8.2A8.75 8.75 0 0 0 24 22.2a8.75 8.75 0 0 0 4.4-8.2A8.75 8.75 0 0 0 24 5.8z"
      />
    </svg>
  )
}

function LogoPix() {
  return (
    <svg viewBox="0 0 48 28" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g transform="translate(24 14) scale(1.12) translate(-13.5 -10)">
        <path
          fill={PAY_GOLD}
          d="M10.2 3.2c-.7 0-1.37.28-1.86.77L4.2 8.1A2.63 2.63 0 0 0 3.43 10c0 .7.27 1.36.77 1.86l4.14 4.14c.5.5 1.16.77 1.86.77s1.37-.28 1.86-.77l1.4-1.4-2.96-2.96a.9.9 0 0 1 0-1.27l2.96-2.96-1.4-1.4A2.63 2.63 0 0 0 10.2 3.2zm1.6 5.05L9.4 10.65l2.4 2.4 2.4-2.4-2.4-2.4zm5.05-1.6-1.4 1.4 2.96 2.96a.9.9 0 0 1 0 1.27l-2.96 2.96 1.4 1.4c.5.5 1.16.77 1.86.77s1.37-.28 1.86-.77l4.14-4.14c.5-.5.77-1.16.77-1.86 0-.7-.27-1.36-.77-1.86l-4.14-4.14A2.63 2.63 0 0 0 16.85 3.2c-.7 0-1.37.28-1.86.77z"
        />
      </g>
    </svg>
  )
}

function LogoElo() {
  return (
    <svg viewBox="0 0 48 28" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <circle cx="24" cy="14" r="9.6" fill={PAY_GOLD} />
      <circle cx="24" cy="14" r="3.85" fill="#fffdf8" />
      <path
        fill="none"
        stroke="#fffdf8"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
        d="M30.1 8.6a9.6 9.6 0 0 0-12.2 0"
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

        <div className="site-footer__col site-footer__col--pagamento">
          <h4>Pagamento</h4>
          <div className="site-footer__payments" role="list">
            {footerHome.payments.map((method) => {
              const Logo = paymentLogos[method]
              const slug = method.toLowerCase()
              return (
                <span
                  key={method}
                  className={`site-footer__payment site-footer__payment--${slug}`}
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
