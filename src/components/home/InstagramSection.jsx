import { instagramHome } from '../../data/homeData'

function InstagramSection() {
  const { eyebrow, title, handle, href, images } = instagramHome

  return (
    <section id="instagram" className="instagram-section section" aria-labelledby="instagram-title">
      <div className="container">
        <div className="section-head">
          <p className="section-head__eyebrow">{eyebrow}</p>
          <h2 id="instagram-title" className="section-head__title">
            {title}
          </h2>
          <p className="section-head__desc">
            Looks e detalhes reais da marca.{' '}
            <a href={href} target="_blank" rel="noopener noreferrer" className="instagram-section__handle">
              {handle}
            </a>
          </p>
        </div>

        <div className="instagram-section__grid">
          {images.map((item) => (
            <a
              key={item.src}
              href={item.href || href}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-section__item"
              aria-label={item.alt}
            >
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
            </a>
          ))}
        </div>

        <div className="instagram-section__actions">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-section__cta"
          >
            Seguir no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

export default InstagramSection
