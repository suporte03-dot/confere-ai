import { featuredCollection } from '../../data/homeData'
import VisualMedia from '../VisualMedia'

function FeaturedCollection() {
  return (
    <section className="featured-collection">
      <div className="container featured-collection__inner">
        <div className="featured-collection__visual">
          <VisualMedia
            src={null}
            alt={featuredCollection.title}
            label={featuredCollection.title}
            variant={featuredCollection.variant}
            className="featured-collection__media"
            imgClassName="featured-collection__img"
          />
        </div>
        <div className="featured-collection__content">
          <span className="featured-collection__eyebrow">Coleção em destaque</span>
          <h2>{featuredCollection.title}</h2>
          <p>{featuredCollection.description}</p>
          <div className="featured-collection__actions">
            <a href="#produtos" className="btn btn--light">{featuredCollection.primaryCta}</a>
            <a href="#colecoes" className="btn btn--ghost-light">{featuredCollection.secondaryCta}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
