const LINKS = [
  { label: 'Coleções', href: '#colecoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Lojas', href: '#lojas' },
  { label: 'Contato', href: '#contato' },
]

const SOCIAL = ['Instagram', 'Pinterest', 'LinkedIn']

function LandingFooter() {
  return (
    <footer id="contato" className="lp-footer">
      <div className="lp-container lp-footer__grid">
        <div className="lp-footer__brand">
          <img
            src="/images/brand/logo-terraestilo-stacked.png"
            alt="TerraEstilo"
            className="lp-footer__logo"
          />
          <p>MODA QUE VESTE ORIGENS</p>
        </div>

        <nav className="lp-footer__nav" aria-label="Links do rodapé">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </nav>

        <div id="lojas" className="lp-footer__contact">
          <h3>Contato</h3>
          <a href="mailto:contato@terraestilo.com.br">contato@terraestilo.com.br</a>
          <span>+55 (51) 3000-0000</span>
          <span>Porto Alegre • RS</span>
        </div>

        <div className="lp-footer__social">
          <h3>Redes</h3>
          <div className="lp-footer__social-links">
            {SOCIAL.map((name) => (
              <a key={name} href={`#${name.toLowerCase()}`}>{name}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="lp-container lp-footer__bottom">
        <span>© {new Date().getFullYear()} TerraEstilo. Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}

export default LandingFooter
