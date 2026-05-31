import Logo from './Logo'
import { footerLinks, paymentMethods } from '../data/mockData'
import { useShop } from '../context/ShopContext'

function Footer() {
  const { navigateToCollection } = useShop()

  const handleLink = (filter, e) => {
    e.preventDefault()
    navigateToCollection(filter)
  }

  return (
    <footer id="sobre" className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo variant="full" tone="light" />
          <p>
            TerraEstilo é moda casual premium com raízes gaúchas — qualidade, conforto
            e estilo para toda a família.
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

        <nav className="footer__col">
          <h4>Loja</h4>
          <ul>
            {footerLinks.loja.map((l) => (
              <li key={l.label}>
                <a href="#produtos" onClick={(e) => handleLink(l.filter, e)}>{l.label}</a>
              </li>
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
          <p className="footer__copy">© {new Date().getFullYear()} TerraEstilo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
