import { footerLinks, paymentMethods } from '../data/mockData'
import { useShop } from '../context/ShopContext'
import BrandMark from './BrandMark'

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
          <BrandMark variant="footer" showTagline className="footer__brand-mark" />
          <p>
            Terra & Estilo é a marca do agro brasileiro — elegância, autenticidade e identidade em cada peça.
          </p>
          <p className="footer__tagline">A marca do agro brasileiro</p>
          <div className="footer__social">
            <a href="https://instagram.com/Terra_Estilo" target="_blank" rel="noopener noreferrer">@Terra_Estilo</a>
            <a href="https://wa.me/5554999398038" target="_blank" rel="noopener noreferrer">WhatsApp</a>
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
            <li><a href="https://wa.me/5554999398038">(54) 99939-8038</a></li>
            <li><span>Carazinho • RS</span></li>
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
        <p className="footer__copy">© {new Date().getFullYear()} Terra & Estilo. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
