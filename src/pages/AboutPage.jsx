import { Link } from 'react-router-dom'
import SectionDivider from '../components/home/SectionDivider'
import AboutBrand from '../components/home/AboutBrand'
import BrandValues from '../components/home/BrandValues'
import { assetUrl } from '../utils/assetUrl'

function AboutPage() {
  return (
    <main className="about-page">
      <section className="catalog-banner catalog-banner--about" aria-labelledby="about-title">
        <img
          src={assetUrl('/images/categorias/moletons-masculinos.jpg')}
          alt=""
          className="catalog-banner__img"
          style={{ objectPosition: 'center 30%' }}
          decoding="async"
        />
        <div className="catalog-banner__shade" aria-hidden="true" />
        <div className="container catalog-banner__content">
          <p className="catalog-banner__eyebrow">Nossa essência</p>
          <h1 id="about-title" className="catalog-banner__title">
            Sobre a Terra &amp; Estilo
          </h1>
          <p className="catalog-banner__desc">
            A marca do agro brasileiro — elegância, origem e autenticidade em cada peça.
          </p>
        </div>
      </section>

      <SectionDivider variant="light" showSaint />

      <div className="container catalog-page__body">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Sobre</span>
        </nav>
      </div>

      <AboutBrand />
      <BrandValues />
      <SectionDivider variant="light" showSaint />
    </main>
  )
}

export default AboutPage
