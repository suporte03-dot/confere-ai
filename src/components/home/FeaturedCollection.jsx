import {
  featuredCollection,
  BRAND_LOGO_CIRCULAR_SRC,
} from '../../data/homeData'

function FeaturedCollection() {
  const {
    eyebrow,
    title,
    description,
    primaryCta,
    secondaryCta,
    image,
    imageAlt,
    marble,
  } = featuredCollection

  return (
    <section className="featured-collection section" aria-labelledby="featured-collection-title">
      <div className="container">
        <div className="featured-collection__panel">
          <div className="featured-collection__visual">
            <img
              src={image}
              alt={imageAlt}
              className="featured-collection__img"
              width={1148}
              height={1371}
              loading="lazy"
              decoding="async"
            />
            <span className="featured-collection__visual-fade" aria-hidden="true" />
          </div>

          <div className="featured-collection__logo-wrap" aria-hidden="true">
            <span className="featured-collection__logo-glow" />
            <img
              src={BRAND_LOGO_CIRCULAR_SRC}
              alt=""
              className="featured-collection__logo"
              width={320}
              height={320}
              decoding="async"
            />
          </div>

          <div
            className="featured-collection__content"
            style={{ '--featured-marble': `url(${marble})` }}
          >
            <span className="featured-collection__eyebrow">{eyebrow}</span>
            <div className="featured-collection__rule" aria-hidden="true">
              <span className="featured-collection__rule-line" />
              <span className="featured-collection__rule-leaf">❧</span>
              <span className="featured-collection__rule-line" />
            </div>
            <h2 id="featured-collection-title">{title}</h2>
            <p>{description}</p>
            <div className="featured-collection__actions">
              <a href="#produtos" className="btn btn--dark featured-collection__btn-primary">
                {primaryCta}
              </a>
              <a href="#colecoes" className="btn btn--ghost-light featured-collection__btn-secondary">
                {secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
