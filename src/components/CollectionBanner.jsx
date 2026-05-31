function CollectionBanner() {
  return (
    <section className="collection-banner">
      <div className="container collection-banner__inner">
        <div className="collection-banner__content">
          <span className="collection-banner__tag">Coleção exclusiva</span>
          <h2>Horizonte — do campo à cidade</h2>
          <p>
            Texturas naturais, cores terrosas e modelagens confortáveis para quem vive o
            Brasil com autenticidade.
          </p>
          <a href="#produtos" className="btn btn--light">Conhecer a coleção</a>
        </div>
        <div className="collection-banner__visual" aria-hidden="true" />
      </div>
    </section>
  )
}

export default CollectionBanner
