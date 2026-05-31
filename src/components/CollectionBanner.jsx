import { collectionBanner } from '../data/mockData'
import VisualMedia from './VisualMedia'

function CollectionBanner() {
  return (
    <section className="collection-banner">
      <div className="container collection-banner__inner">
        <div className="collection-banner__content">
          <span className="collection-banner__tag">{collectionBanner.label}</span>
          <h2>{collectionBanner.title}</h2>
          <p>{collectionBanner.subtitle}</p>
          <a href="#produtos" className="btn btn--light">{collectionBanner.cta}</a>
        </div>
        <div className="collection-banner__visual">
          <VisualMedia
            src={collectionBanner.image}
            alt={collectionBanner.title}
            label={collectionBanner.label}
            variant={collectionBanner.variant}
            className="collection-banner__media"
            imgClassName="collection-banner__img"
          />
        </div>
      </div>
    </section>
  )
}

export default CollectionBanner
