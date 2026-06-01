import { footerLinks, paymentMethods } from '../data/mockData'
import { useShop } from '../context/ShopContext'

function Footer() {
  const { navigateToCollection } = useShop()

  const handleLink = (filter, e) => {
    e.preventDefault()
    navigateToCollection(filter)
  }

  return (
    <footer id="contato" className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img
            src="/images/brand/logo-terraestilo-stacked.png"
            alt="TerraEstilo"
            className="brand-logo brand-logo--footer"
          />
          <p>
            TerraEstilo é moda premium com raízes no Sul do Brasil — elegância natural,
            autenticidade e identidade em cada peça.
          </p>
          <p className="footer__tagline">Moda que veste origens</p>
          <div className="footer__social">
            {['Instagram', 'Pinterest', 'Facebook'].map((s) => (
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
          <h4>Masculino</h4>
          <ul>
            {footerLinks.masculino.slice(0, 6).map((l) => (
              <li key={l.label}>
                <a href="#produtos" onClick={(e) => handleLink(l.filter, e)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col">
          <h4>Feminino</h4>
          <ul>
            {footerLinks.feminino.slice(0, 6).map((l) => (
              <li key={l.label}>
                <a href="#produtos" onClick={(e) => handleLink(l.filter, e)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col" id="lojas">
          <h4>Contato</h4>
          <ul>
            <li><a href="mailto:contato@terraestilo.com.br">contato@terraestilo.com.br</a></li>
            <li><span>+55 (51) 3000-0000</span></li>
            <li><span>Porto Alegre • RS</span></li>
          </ul>
          <h4 id="trocas">Pagamento</h4>
          <div className="footer__payments">
            {paymentMethods.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p className="footer__copy">© {new Date().getFullYear()} TerraEstilo. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
