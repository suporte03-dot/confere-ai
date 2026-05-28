function CTA() {
  return (
    <section className="section cta">
      <div className="container">
        <div className="cta-panel">
          <div className="cta-panel__bg" aria-hidden="true">
            <div className="cta-panel__grid" />
            <div className="cta-panel__doc cta-panel__doc--1" />
            <div className="cta-panel__doc cta-panel__doc--2" />
          </div>
          <div className="cta-panel__content">
            <h2 className="cta-panel__title">Pronto para reduzir retrabalho na sua conferência?</h2>
            <p className="cta-panel__text">
              Automatize comparações, valide informações e encontre divergências em segundos com
              uma análise clara e exportável.
            </p>
            <div className="cta-panel__actions">
              <a href="#upload" className="btn btn--white btn--lg">
                Iniciar conferência
              </a>
              <a href="#resultado" className="btn btn--ghost-light btn--lg">
                Ver relatório exemplo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
