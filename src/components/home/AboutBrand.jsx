import { aboutBrand } from '../../data/homeData'
import VisualMedia from '../VisualMedia'

function AboutBrand() {
  return (
    <section id="sobre" className="about-brand section">
      <div className="container about-brand__inner">
        <div className="about-brand__content">
          <h2 className="about-brand__title">{aboutBrand.title}</h2>
          <p className="about-brand__text">{aboutBrand.text}</p>
          <a href="#contato" className="btn btn--outline">{aboutBrand.cta}</a>
        </div>
        <div className="about-brand__visual">
          <VisualMedia
            src={null}
            alt=""
            label="Editorial TerraEstilo"
            variant="hero"
            className="about-brand__media"
            imgClassName="about-brand__img"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutBrand
