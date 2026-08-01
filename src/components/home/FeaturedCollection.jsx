import { Link } from 'react-router-dom'
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
    primaryHref = '/colecoes/raizes-do-sul',
    secondaryHref = '/#instagram',
  } = featuredCollection

  return (
    <section
      id="colecoes"
      className="featured-collection-wrapper"
      aria-labelledby="featured-collection-title"
    >
      <div className="featured-collection featured-collection--campaign">
        <div className="featured-collection__media">
          <img
            src={image}
            alt={imageAlt}
            className="featured-collection__media-img"
            loading="lazy"
            decoding="async"
          />
          <div className="featured-collection__transition" aria-hidden="true" />
        </div>

        <div className="featured-collection__logo" aria-hidden="true">
          <img
            src={BRAND_LOGO_CIRCULAR_SRC}
            alt=""
            width={200}
            height={200}
            decoding="async"
          />
        </div>

        <div className="featured-collection__content">
          <span className="featured-collection__eyebrow">{eyebrow}</span>
          <div className="featured-collection__ornament" aria-hidden="true">
            <span className="featured-collection__ornament-line" />
            <svg
              className="featured-collection__ornament-leaf"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3c-1.8 3.2-6 5.4-6 10.2A6 6 0 0 0 12 19a6 6 0 0 0 6-5.8C18 8.4 13.8 6.2 12 3Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M12 19V9.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span className="featured-collection__ornament-line featured-collection__ornament-line--rev" />
          </div>
          <h2 id="featured-collection-title" className="featured-collection__title">
            {title}
          </h2>
          <p className="featured-collection__description">{description}</p>
          <div className="featured-collection__actions">
            <Link
              to={primaryHref}
              className="featured-collection__button featured-collection__button--primary"
            >
              {primaryCta}
              <svg
                className="featured-collection__button-arrow"
                viewBox="0 0 16 16"
                width="14"
                height="14"
                aria-hidden="true"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            {secondaryCta && (
              <Link
                to={secondaryHref}
                className="featured-collection__button featured-collection__button--secondary"
              >
                {secondaryCta}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
