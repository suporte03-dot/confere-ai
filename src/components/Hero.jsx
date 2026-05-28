import UploadCard from './UploadCard'

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge">Conferência inteligente</span>
          <h1 className="hero__title">
            Compare arquivos e encontre divergências automaticamente
          </h1>
          <p className="hero__subtitle">
            Envie PDFs, planilhas, XMLs ou relatórios e receba uma análise clara com
            diferenças, valores divergentes, itens faltantes e resumo pronto para
            conferência.
          </p>
          <div className="hero__actions">
            <a href="#upload" className="btn btn--primary">
              Começar análise
            </a>
            <a href="#exemplos" className="btn btn--outline">
              Ver exemplos
            </a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <strong>98%</strong>
              <span>precisão na detecção</span>
            </div>
            <div className="hero__stat">
              <strong>12+</strong>
              <span>formatos suportados</span>
            </div>
            <div className="hero__stat">
              <strong>3s</strong>
              <span>tempo médio de análise</span>
            </div>
          </div>
        </div>
        <div id="upload" className="hero__upload">
          <UploadCard />
        </div>
      </div>
    </section>
  )
}

export default Hero
