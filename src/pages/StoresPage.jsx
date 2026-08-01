import { Link } from 'react-router-dom'
import SectionDivider from '../components/home/SectionDivider'
import { footerHome } from '../data/homeData'
import { assetUrl } from '../utils/assetUrl'

function StoresPage() {
  return (
    <main className="stores-page">
      <section className="catalog-banner catalog-banner--stores" aria-labelledby="stores-title">
        <img
          src={assetUrl('/images/categorias/polos.jpg')}
          alt=""
          className="catalog-banner__img"
          style={{ objectPosition: 'center 28%' }}
          decoding="async"
        />
        <div className="catalog-banner__shade" aria-hidden="true" />
        <div className="container catalog-banner__content">
          <p className="catalog-banner__eyebrow">Presença</p>
          <h1 id="stores-title" className="catalog-banner__title">
            Nossas lojas
          </h1>
          <p className="catalog-banner__desc">
            Atendimento online para todo o Brasil — e em breve novos pontos físicos na Serra Gaúcha.
          </p>
        </div>
      </section>

      <SectionDivider variant="light" showSaint />

      <div className="container catalog-page__body stores-page__body">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Lojas</span>
        </nav>

        <div className="stores-card">
          <h2>Loja online</h2>
          <p>
            Compre com segurança, frete para todo o Brasil e atendimento humanizado via WhatsApp e
            Instagram.
          </p>
          <ul>
            <li>Horário: {footerHome.atendimento.hours}</li>
            <li>WhatsApp: {footerHome.atendimento.whatsapp}</li>
            <li>Serra Gaúcha — RS</li>
          </ul>
          <div className="stores-card__actions">
            <Link to="/contato" className="btn btn--gold">
              Falar com atendimento
            </Link>
            <Link to="/colecoes" className="btn btn--outline">
              Ver coleções
            </Link>
          </div>
        </div>
      </div>

      <SectionDivider variant="light" showSaint />
    </main>
  )
}

export default StoresPage
