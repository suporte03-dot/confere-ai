import { aboutBrand, BRAND_HERO_BOARD_SRC } from '../../data/homeData'

function AboutBrand() {
  return (
    <section id="sobre" className="about-brand section">
      <div className="container about-brand__inner">
        <div className="about-brand__content">
          <span className="about-brand__eyebrow">Nossa essência</span>
          <h2 className="about-brand__title">{aboutBrand.title}</h2>
          <p className="about-brand__text">{aboutBrand.text}</p>
          <a href="#contato" className="btn btn--gold">{aboutBrand.cta}</a>
        </div>
        <div className="about-brand__visual">
          <div className="about-brand__frame">
            <img
              src={BRAND_HERO_BOARD_SRC}
              alt="Composição visual TerraEstilo"
              className="about-brand__img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutBrand
