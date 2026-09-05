'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '../components/ProductCard'
import SectionDivider from '../components/home/SectionDivider'
import Newsletter from '../components/home/Newsletter'
import {
  categoryMeta,
  getFacetOptions,
  filterAndSortProducts,
  SORT_OPTIONS,
  PRICE_RANGES,
} from '../data/catalog'
import { getColorHex } from '../data/mockData'
import {
  getProductsForCategoryScope,
  getDbSubGroupsForCategory,
  findCategoryNavNode,
} from '../lib/catalog/category-nav'
import { useShop } from '../context/ShopContext'

const INITIAL_FILTERS = {
  subcategory: '',
  subKey: '',
  size: '',
  color: '',
  priceRange: 'all',
  availability: 'all',
  onlyNew: false,
  onlyBestsellers: false,
}

function CategoryPage({ category, products: productsProp }) {
  return <CategoryPageContent key={category} category={category} productsProp={productsProp} />
}

function CategoryPageContent({ category, productsProp }) {
  const { products: catalogProducts, categories } = useShop()

  const sourceProducts = productsProp ?? catalogProducts ?? []
  const navNode = useMemo(
    () => findCategoryNavNode(categories, category),
    [categories, category],
  )
  const dbSubGroups = useMemo(
    () => getDbSubGroupsForCategory(category, categories),
    [category, categories],
  )
  const meta = useMemo(() => {
    const staticMeta = categoryMeta[category]
    if (staticMeta) return staticMeta
    if (!navNode) return null
    return {
      slug: navNode.slug,
      title: navNode.name,
      eyebrow: 'Categoria',
      headline: navNode.name,
      description: '',
      bannerImage: categoryMeta.feminino?.bannerImage,
      objectPosition: 'center 28%',
    }
  }, [category, navNode])

  const baseProducts = useMemo(
    () => getProductsForCategoryScope(category, sourceProducts, categories, ''),
    [category, sourceProducts, categories],
  )
  const facets = useMemo(() => {
    const base = getFacetOptions(baseProducts, category)
    if (dbSubGroups.length) {
      return { ...base, subGroups: dbSubGroups }
    }
    return base
  }, [baseProducts, category, dbSubGroups])

  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    subKey: subFromUrl,
  })
  const [sortId, setSortId] = useState('relevantes')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setFilters((prev) => ({ ...prev, subKey: subFromUrl }))
  }, [subFromUrl])

  useEffect(() => {
    if (!filtersOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setFiltersOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('filters-drawer-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('filters-drawer-open')
    }
  }, [filtersOpen])

  const scopedProducts = useMemo(
    () =>
      getProductsForCategoryScope(
        category,
        sourceProducts,
        categories,
        filters.subKey || '',
      ),
    [category, sourceProducts, categories, filters.subKey],
  )

  const visible = useMemo(
    () =>
      filterAndSortProducts(
        scopedProducts,
        { ...filters, subKey: '', subcategory: '' },
        sortId,
      ),
    [scopedProducts, filters, sortId],
  )

  const sections = null

  const activeFilterCount = [
    filters.subKey,
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
    router.replace(pathname)
  }

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const selectSubKey = (subKey) => {
    setFilters((prev) => ({ ...prev, subKey, subcategory: '' }))
    if (subKey) {
      router.replace(`${pathname}?sub=${encodeURIComponent(subKey)}`)
    } else {
      router.replace(pathname)
    }
  }

  if (!meta) {
    return (
      <main className="catalog-page">
        <div className="container catalog-page__empty">
          <h1>Categoria não encontrada</h1>
          <Link href="/" className="btn btn--gold">
            Voltar ao início
          </Link>
        </div>
      </main>
    )
  }

  const activeSubLabel = filters.subKey
    ? dbSubGroups.find((g) => g.id === filters.subKey)?.label || filters.subKey
    : null

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
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{meta.title}</span>
          {activeSubLabel && (
            <>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{activeSubLabel}</span>
            </>
          )}
        </nav>

        <header className="catalog-page__head">
          <div>
            <h2 className="catalog-page__title">
              {activeSubLabel ? `${meta.title} · ${activeSubLabel}` : meta.title}
            </h2>
            <p className="catalog-page__lead">{meta.description}</p>
          </div>
          <p className="catalog-page__count" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'produto' : 'produtos'}
          </p>
        </header>

        {facets.subGroups?.length > 0 && (
          <div
            className="catalog-subnav"
            role="tablist"
            aria-label={`Subcategorias de ${meta.title}`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={!filters.subKey}
              className={`catalog-subnav__chip${!filters.subKey ? ' is-active' : ''}`}
              onClick={() => selectSubKey('')}
            >
              Todos
            </button>
            {facets.subGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={filters.subKey === group.id}
                className={`catalog-subnav__chip${filters.subKey === group.id ? ' is-active' : ''}`}
                onClick={() => selectSubKey(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}

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
          <button
            type="button"
            className={`catalog-filters-overlay${filtersOpen ? ' is-open' : ''}`}
            aria-label="Fechar filtros"
            tabIndex={filtersOpen ? 0 : -1}
            onClick={() => setFiltersOpen(false)}
          />
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

            {category !== 'feminino' &&
              category !== 'masculino' &&
              facets.subGroups?.length > 0 && (
              <fieldset className="catalog-filter">
                <legend>Tipo de peça</legend>
                <div className="catalog-filter__chips">
                  <button
                    type="button"
                    className={!filters.subKey ? 'is-active' : ''}
                    onClick={() => selectSubKey('')}
                  >
                    Todos
                  </button>
                  {facets.subGroups.map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      className={filters.subKey === group.id ? 'is-active' : ''}
                      onClick={() =>
                        selectSubKey(filters.subKey === group.id ? '' : group.id)
                      }
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

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
                <p>
                  {baseProducts.length === 0
                    ? 'Nenhum produto publicado nesta categoria no momento.'
                    : 'Nenhum produto encontrado com esses filtros.'}
                </p>
                {baseProducts.length > 0 && activeFilterCount > 0 ? (
                  <button type="button" className="btn btn--gold" onClick={clearFilters}>
                    Limpar filtros
                  </button>
                ) : (
                  <Link href="/" className="btn btn--gold">
                    Voltar ao início
                  </Link>
                )}
              </div>
            ) : sections && sections.length > 1 ? (
              <div className="search-page__sections">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    className="catalog-subsection"
                    aria-labelledby={`cat-section-${section.id}`}
                  >
                    <header className="catalog-subsection__head">
                      <h3 id={`cat-section-${section.id}`} className="catalog-subsection__title">
                        {section.label}
                      </h3>
                      <button
                        type="button"
                        className="catalog-subsection__link"
                        onClick={() => selectSubKey(section.id)}
                      >
                        Ver só {section.label.toLowerCase()}
                      </button>
                    </header>
                    <div className="products-grid products-grid--catalog">
                      {section.products.map((product) => (
                        <ProductCard key={product.id} product={product} tone="light" showSizes />
                      ))}
                    </div>
                  </section>
                ))}
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
