import {
  featuredCollection,
  BRAND_LOGO_CIRCULAR_SRC,
} from '../../data/homeData'
import { assetUrl } from '../../utils/assetUrl'

const PATTERN_SRC = assetUrl('/images/brand/te-monogram-pattern.svg')
const NOSSA_SENHORA_SRC = assetUrl('/images/brand/nossa-senhora-aparecida.svg')

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
    <section
      className="featured-collection-wrapper"
      aria-labelledby="featured-collection-title"
      style={{
        '--featured-marble': `url(${marble})`,
        '--featured-pattern': `url(${PATTERN_SRC})`,
      }}
    >
      <div className="featured-collection">
        <div className="featured-collection__media">
          <img
            src={image}
            alt={imageAlt}
            className="featured-collection__media-img"
            width={1246}
            height={1575}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="featured-collection__logo" aria-hidden="true">
          <img
            src={BRAND_LOGO_CIRCULAR_SRC}
            alt=""
            width={360}
            height={360}
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
            <a
              href="#produtos"
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
            </a>
            <a
              href="#colecoes"
              className="featured-collection__button featured-collection__button--secondary"
            >
              {secondaryCta}
            </a>
          </div>
        </div>

        <div className="featured-collection__bottom-band" aria-hidden="true">
          <svg
            className="featured-collection__bottom-band-curve"
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48V18C240 4 480 0 720 0s480 4 720 18v30H0Z"
              fill="#0a0a0a"
            />
            <path
              d="M0 18C240 4 480 0 720 0s480 4 720 18"
              fill="none"
              stroke="rgba(201,155,50,0.72)"
              strokeWidth="1.5"
            />
          </svg>
          <div className="featured-collection__bottom-band-body">
            <span className="featured-collection__bottom-band-pattern" />
            <div className="featured-collection__saint-wrapper">
              <img
                src={NOSSA_SENHORA_SRC}
                alt="Nossa Senhora Aparecida"
                className="featured-collection__saint"
                width={80}
                height={108}
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
