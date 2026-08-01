import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionDivider from '../components/home/SectionDivider'
import Newsletter from '../components/home/Newsletter'
import {
  brandCollections,
  getCollectionMeta,
  getProductsByCollection,
  filterAndSortProducts,
  SORT_OPTIONS,
} from '../data/catalog'
import { products } from '../data/mockData'

function CollectionsPage() {
  const { slug } = useParams()
  const [sortId, setSortId] = useState('relevantes')

  const active = slug ? getCollectionMeta(slug) : null
  const baseProducts = useMemo(() => {
    if (slug) return getProductsByCollection(slug, products)
    return products.filter((p) => brandCollections.some((c) => c.slug === p.collection))
  }, [slug])

  const visible = useMemo(
    () => filterAndSortProducts(baseProducts, {}, sortId),
    [baseProducts, sortId],
  )

  const title = active?.title || 'Coleções'
  const description =
    active?.description ||
    'Curadoria Terra & Estilo — campanhas com identidade, presença e acabamento premium.'
  const bannerImage = active?.image || brandCollections[0].image
  const objectPosition = active?.objectPosition || 'center 28%'

  return (
    <main className="catalog-page">
      <section className="catalog-banner catalog-banner--collections" aria-labelledby="collections-title">
        <img
          src={bannerImage}
          alt=""
          className="catalog-banner__img"
          style={{ objectPosition }}
          decoding="async"
        />
        <div className="catalog-banner__shade" aria-hidden="true" />
        <div className="container catalog-banner__content">
          <p className="catalog-banner__eyebrow">Campanhas</p>
          <h1 id="collections-title" className="catalog-banner__title">
            {title}
          </h1>
          <p className="catalog-banner__desc">{description}</p>
        </div>
      </section>

      <SectionDivider variant="light" showSaint />

      <div className="container catalog-page__body">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          {slug ? (
            <>
              <Link to="/colecoes">Coleções</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </>
          ) : (
            <span aria-current="page">Coleções</span>
          )}
        </nav>

        {!slug && (
          <div className="collections-grid">
            {brandCollections.map((collection) => (
              <Link
                key={collection.slug}
                to={`/colecoes/${collection.slug}`}
                className="collections-card"
              >
                <img
                  src={collection.image}
                  alt=""
                  style={{ objectPosition: collection.objectPosition }}
                  loading="lazy"
                  decoding="async"
                />
                <span className="collections-card__shade" aria-hidden="true" />
                <span className="collections-card__body">
                  <strong>{collection.title}</strong>
                  <em>{collection.description}</em>
                  <span>Ver coleção →</span>
                </span>
              </Link>
            ))}
          </div>
        )}

        {slug && (
          <>
            <header className="catalog-page__head">
              <div>
                <h2 className="catalog-page__title">{title}</h2>
                <p className="catalog-page__lead">{description}</p>
              </div>
              <p className="catalog-page__count">
                {visible.length} {visible.length === 1 ? 'produto' : 'produtos'}
              </p>
            </header>

            <div className="catalog-toolbar">
              <label className="catalog-toolbar__sort">
                <span>Ordenar</span>
                <select value={sortId} onChange={(e) => setSortId(e.target.value)}>
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <Link to="/colecoes" className="catalog-toolbar__clear">
                Ver todas as coleções
              </Link>
            </div>

            {visible.length === 0 ? (
              <div className="catalog-page__empty" role="status">
                <p>Nenhum produto nesta coleção ainda.</p>
                <Link to="/colecoes" className="btn btn--gold">
                  Ver todas
                </Link>
              </div>
            ) : (
              <div className="products-grid products-grid--catalog">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} tone="light" showSizes />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <SectionDivider variant="light" showSaint />
      <Newsletter />
    </main>
  )
}

export default CollectionsPage
