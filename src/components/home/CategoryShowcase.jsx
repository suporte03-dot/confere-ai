import { useCallback, useState } from 'react'
import { categorias } from '../../data/homeData'

function CategoryShowcase() {
  const [failedImages, setFailedImages] = useState(() => new Set())

  const handleImageError = useCallback((imagem) => {
    setFailedImages((prev) => {
      if (prev.has(imagem)) return prev
      const next = new Set(prev)
      next.add(imagem)
      return next
    })
  }, [])

  return (
    <section id="colecoes" className="categorias-section section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-head__title">Navegue por categoria</h2>
          <p className="section-head__desc">
            Explore as principais categorias da coleção.
          </p>
        </div>
        <div className="categorias-grid">
          {categorias.map((categoria) => {
            const imageFailed = failedImages.has(categoria.imagem)

            return (
              <a
                key={categoria.url}
                href={categoria.url}
                target="_blank"
                rel="noopener noreferrer"
                className="categoria-card"
              >
                <div className="categoria-card__media">
                  {!imageFailed && (
                    <img
                      src={categoria.imagem}
                      alt={categoria.nome}
                      className="categoria-card__img"
                      loading="lazy"
                      onError={() => handleImageError(categoria.imagem)}
                    />
                  )}
                  <div className="categoria-card__overlay" aria-hidden="true" />
                </div>
                <div className="categoria-card__body">
                  <h3>{categoria.nome}</h3>
                  <span className="categoria-card__cta">Ver produtos</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
