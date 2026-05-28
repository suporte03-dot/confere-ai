function CTA() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta__card">
          <div className="cta__pattern" aria-hidden="true">
            <div className="cta__line cta__line--1" />
            <div className="cta__line cta__line--2" />
            <div className="cta__doc cta__doc--1" />
            <div className="cta__doc cta__doc--2" />
          </div>

          <div className="cta__content">
            <h2 className="cta__title">
              Pare de perder tempo conferindo arquivos manualmente
            </h2>
            <p className="cta__text">
              O ConfereAI transforma PDFs, planilhas e relatórios em uma análise clara,
              organizada e pronta para tomada de decisão.
            </p>
            <div className="cta__actions">
              <a href="#upload" className="btn btn--white">
                Criar minha primeira análise
              </a>
              <a href="#resultado" className="btn btn--ghost-light">
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
