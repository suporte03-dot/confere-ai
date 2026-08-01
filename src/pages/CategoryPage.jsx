import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionDivider from '../components/home/SectionDivider'
import Newsletter from '../components/home/Newsletter'
import {
  categoryMeta,
  getProductsByCategory,
  getFacetOptions,
  filterAndSortProducts,
  SORT_OPTIONS,
  PRICE_RANGES,
} from '../data/catalog'
import { getColorHex } from '../data/mockData'

const INITIAL_FILTERS = {
  subcategory: '',
  size: '',
  color: '',
  priceRange: 'all',
  availability: 'all',
  onlyNew: false,
  onlyBestsellers: false,
}

function CategoryPage({ category }) {
  return <CategoryPageContent key={category} category={category} />
}

function CategoryPageContent({ category }) {
  const meta = categoryMeta[category]
  const baseProducts = useMemo(() => getProductsByCategory(category), [category])
  const facets = useMemo(() => getFacetOptions(baseProducts), [baseProducts])

  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sortId, setSortId] = useState('relevantes')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const visible = useMemo(
    () => filterAndSortProducts(baseProducts, filters, sortId),
    [baseProducts, filters, sortId],
  )

  const activeFilterCount = [
    filters.subcategory,
    filters.size,
    filters.color,
    filters.priceRange !== 'all' ? filters.priceRange : '',
    filters.availability !== 'all' ? filters.availability : '',
    filters.onlyNew,
    filters.onlyBestsellers,
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setSortId('relevantes')
  }

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (!meta) {
    return (
      <main className="catalog-page">
        <div className="container catalog-page__empty">
          <h1>Categoria não encontrada</h1>
          <Link to="/" className="btn btn--gold">
            Voltar ao início
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="catalog-page">
      <section className="catalog-banner" aria-labelledby="catalog-title">
        <img
          src={meta.bannerImage}
          alt=""
          className="catalog-banner__img"
          style={{ objectPosition: meta.objectPosition }}
          decoding="async"
        />
        <div className="catalog-banner__shade" aria-hidden="true" />
        <div className="container catalog-banner__content">
          <p className="catalog-banner__eyebrow">{meta.eyebrow}</p>
          <h1 id="catalog-title" className="catalog-banner__title">
            {meta.headline}
          </h1>
          <p className="catalog-banner__desc">{meta.description}</p>
        </div>
      </section>

      <SectionDivider variant="light" showSaint />

      <div className="container catalog-page__body">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{meta.title}</span>
        </nav>

        <header className="catalog-page__head">
          <div>
            <h2 className="catalog-page__title">{meta.title}</h2>
            <p className="catalog-page__lead">{meta.description}</p>
          </div>
          <p className="catalog-page__count" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'produto' : 'produtos'}
          </p>
        </header>

        <div className="catalog-toolbar">
          <button
            type="button"
            className="catalog-toolbar__filters-btn"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            Filtros{activeFilterCount ? ` (${activeFilterCount})` : ''}
          </button>
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
          {activeFilterCount > 0 && (
            <button type="button" className="catalog-toolbar__clear" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>

        <div className="catalog-layout">
          <aside
            className={`catalog-filters${filtersOpen ? ' catalog-filters--open' : ''}`}
            aria-label="Filtros de produtos"
          >
            <div className="catalog-filters__head">
              <h3>Filtros</h3>
              <button
                type="button"
                className="catalog-filters__close"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fechar filtros"
              >
                ×
              </button>
            </div>

            <fieldset className="catalog-filter">
              <legend>Subcategoria</legend>
              <select
                value={filters.subcategory}
                onChange={(e) => setFilter('subcategory', e.target.value)}
              >
                <option value="">Todas</option>
                {facets.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="catalog-filter">
              <legend>Tamanho</legend>
              <div className="catalog-filter__chips">
                <button
                  type="button"
                  className={!filters.size ? 'is-active' : ''}
                  onClick={() => setFilter('size', '')}
                >
                  Todos
                </button>
                {facets.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={filters.size === size ? 'is-active' : ''}
                    onClick={() => setFilter('size', filters.size === size ? '' : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="catalog-filter">
              <legend>Cor</legend>
              <div className="catalog-filter__colors">
                <button
                  type="button"
                  className={!filters.color ? 'is-active' : ''}
                  onClick={() => setFilter('color', '')}
                >
                  Todas
                </button>
                {facets.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={filters.color === color ? 'is-active' : ''}
                    title={color}
                    onClick={() => setFilter('color', filters.color === color ? '' : color)}
                  >
                    <span style={{ backgroundColor: getColorHex(color) }} aria-hidden="true" />
                    {color}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="catalog-filter">
              <legend>Preço</legend>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilter('priceRange', e.target.value)}
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="catalog-filter">
              <legend>Disponibilidade</legend>
              <select
                value={filters.availability}
                onChange={(e) => setFilter('availability', e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="in-stock">Em estoque</option>
                <option value="out-of-stock">Esgotados</option>
              </select>
            </fieldset>

            <fieldset className="catalog-filter catalog-filter--checks">
              <legend>Destaques</legend>
              <label>
                <input
                  type="checkbox"
                  checked={filters.onlyNew}
                  onChange={(e) => setFilter('onlyNew', e.target.checked)}
                />
                Novidades
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.onlyBestsellers}
                  onChange={(e) => setFilter('onlyBestsellers', e.target.checked)}
                />
                Mais vendidos
              </label>
            </fieldset>

            {activeFilterCount > 0 && (
              <button type="button" className="btn btn--outline catalog-filters__clear" onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </aside>

          <div className="catalog-results">
            {visible.length === 0 ? (
              <div className="catalog-page__empty" role="status">
                <p>Nenhum produto encontrado com esses filtros.</p>
                <button type="button" className="btn btn--gold" onClick={clearFilters}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="products-grid products-grid--catalog">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} tone="light" showSizes />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SectionDivider variant="light" showSaint />
      <Newsletter />
    </main>
  )
}

export default CategoryPage
