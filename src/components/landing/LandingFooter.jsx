import { BRAND_LOGO_CIRCULAR_SRC } from '../../data/homeData'

const LINKS = [
  { label: 'Coleções', href: '#colecoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Lojas', href: '#lojas' },
  { label: 'Contato', href: '#contato' },
]

function LandingFooter() {
  return (
    <footer id="contato" className="lp-footer">
      <div className="lp-container lp-footer__grid">
        <div className="lp-footer__brand">
          <img
            src={BRAND_LOGO_CIRCULAR_SRC}
            alt="Terra & Estilo"
            className="lp-footer__logo"
            width={512}
            height={512}
          />
          <p>A MARCA DO AGRO BRASILEIRO</p>
        </div>

        <nav className="lp-footer__nav" aria-label="Links do rodapé">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div id="lojas" className="lp-footer__contact">
          <h3>Contato</h3>
          <a href="https://instagram.com/Terra_Estilo" target="_blank" rel="noopener noreferrer">@Terra_Estilo</a>
          <a href="https://wa.me/5554999398038" target="_blank" rel="noopener noreferrer">(54) 99939-8038</a>
          <a href="mailto:contato@terraestilo.com.br">contato@terraestilo.com.br</a>
          <span>Carazinho • RS</span>
        </div>

        <div className="lp-footer__social">
          <h3>Redes</h3>
          <div className="lp-footer__social-links">
            <a href="https://instagram.com/Terra_Estilo" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/5554999398038" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="lp-container lp-footer__bottom">
        <span>© {new Date().getFullYear()} Terra & Estilo. Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}

export default LandingFooter
