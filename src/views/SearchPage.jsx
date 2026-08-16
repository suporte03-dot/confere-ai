'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '../components/ProductCard'
import SectionDivider from '../components/home/SectionDivider'
import Newsletter from '../components/home/Newsletter'
import { useShop } from '../context/ShopContext'
import { products, searchProducts } from '../data/mockData'
import {
  groupProductsBySubcategory,
  getSubgroupLabel,
  resolveSearchIntent,
} from '../data/searchMap'

function SearchPage() {
  const params = useSearchParams()
  const q = (params.get('q') || '').trim()
  const subParam = (params.get('sub') || '').trim()
  const catParam = (params.get('cat') || '').trim()
  const router = useRouter()
  const { setSearchQuery, clearSearch } = useShop()

  useEffect(() => {
    if (q) setSearchQuery(q)
  }, [q, setSearchQuery])

  const resetSearch = () => {
    clearSearch()
    router.push('/')
  }

  const intent = useMemo(() => (q ? resolveSearchIntent(q) : null), [q])
  const activeSub = subParam || intent?.sub || ''
  const activeCat = catParam || intent?.category || ''

  const results = useMemo(() => {
    if (!q) return []
    return searchProducts(q, products, {
      category: activeCat || undefined,
      subKey: activeSub || undefined,
    })
  }, [q, activeCat, activeSub])

  const sections = useMemo(
    () => groupProductsBySubcategory(results, activeCat || null),
    [results, activeCat],
  )

  const hintLabel = activeSub
    ? getSubgroupLabel(activeCat || 'feminino', activeSub)
    : null

  return (
    <main className="catalog-page search-page">
      <section className="catalog-banner search-page__banner" aria-labelledby="search-title">
        <div className="catalog-banner__shade" aria-hidden="true" />
        <div className="container catalog-banner__content">
          <p className="catalog-banner__eyebrow">Busca Terra & Estilo</p>
          <h1 id="search-title" className="catalog-banner__title">
            {q ? `Resultados para “${q}”` : 'Buscar produtos'}
          </h1>
          <p className="catalog-banner__desc">
            {q
              ? hintLabel
                ? `Seleção organizada em ${hintLabel.toLowerCase()} e categorias relacionadas.`
                : 'Peças organizadas por categoria para uma descoberta mais clara.'
              : 'Digite na lupa do menu para encontrar blusas, calças, moletons, jaquetas e mais.'}
          </p>
        </div>
      </section>

      <SectionDivider variant="light" showSaint />

      <div className="container catalog-page__body">
        <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Busca</span>
        </nav>

        <header className="catalog-page__head">
          <div>
            <h2 className="catalog-page__title">
              {q ? 'Sua seleção' : 'Comece sua busca'}
            </h2>
            <p className="catalog-page__lead">
              {q
                ? 'Resultados agrupados por tipo de peça — explore cada seção com calma.'
                : 'Use a busca do cabeçalho para encontrar produtos e categorias.'}
            </p>
          </div>
          {q && (
            <p className="catalog-page__count" aria-live="polite">
              {results.length} {results.length === 1 ? 'produto' : 'produtos'}
            </p>
          )}
        </header>

        {!q && (
          <div className="search-page__empty search-page__empty--idle" role="status">
            <p className="search-page__empty-title">O que você procura?</p>
            <p>Experimente: blusa, calça, moletom, jaqueta, boné ou bolsa.</p>
            <div className="search-page__suggestions">
              {['blusa', 'calça', 'moletom', 'jaqueta', 'boné'].map((term) => (
                <Link key={term} href={`/busca?q=${encodeURIComponent(term)}`} className="search-page__chip">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="search-page__empty" role="status">
            <p className="search-page__empty-title">Nenhum produto encontrado</p>
            <p>
              Não encontramos peças para “{q}”. Tente outro termo ou explore as coleções.
            </p>
            <div className="search-page__empty-actions">
              <button type="button" className="btn btn--gold" onClick={resetSearch}>
                Limpar busca
              </button>
              <Link href="/masculino" className="btn btn--outline">
                Ver masculino
              </Link>
              <Link href="/feminino" className="btn btn--outline">
                Ver feminino
              </Link>
            </div>
          </div>
        )}

        {q && results.length > 0 && (
          <div className="search-page__sections">
            {sections.map((section) => (
              <section
                key={section.id}
                className="catalog-subsection"
                aria-labelledby={`search-section-${section.id}`}
              >
                <header className="catalog-subsection__head">
                  <h3 id={`search-section-${section.id}`} className="catalog-subsection__title">
                    {section.label}
                  </h3>
                  <span className="catalog-subsection__count">
                    {section.products.length}{' '}
                    {section.products.length === 1 ? 'peça' : 'peças'}
                  </span>
                </header>
                <div className="products-grid products-grid--catalog">
                  {section.products.map((product) => (
                    <ProductCard key={product.id} product={product} tone="light" showSizes />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <SectionDivider variant="light" showSaint />
      <Newsletter />
    </main>
  )
}

export default SearchPage
