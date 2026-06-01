import { brandEditorial } from '../data/mockData'
import BrandMark from './BrandMark'

function BrandEditorial() {
  return (
    <section id="sobre" className="section brand-editorial">
      <div className="container brand-editorial__inner">
        <div className="brand-editorial__content">
          <p className="brand-editorial__eyebrow">Nossa essência</p>
          <blockquote className="brand-editorial__quote">
            “{brandEditorial.quote}”
          </blockquote>
          <a href="#contato" className="btn btn--outline">{brandEditorial.cta}</a>
        </div>
        <div className="brand-editorial__visual" aria-hidden="true">
          <BrandMark variant="display" showTagline />
        </div>
      </div>
    </section>
  )
}

export default BrandEditorial
