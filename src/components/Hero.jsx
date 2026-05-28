import UploadCard from './UploadCard'
import { IconCheck, IconShield } from './icons/FeatureIcons'

const trustBadges = [
  { label: 'Sem planilhas manuais', Icon: IconCheck },
  { label: 'Relatório exportável', Icon: IconShield },
  { label: 'Conferência inteligente', Icon: IconCheck },
]

function Hero({ showToast }) {
  return (
    <section id="inicio" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="badge badge--outline">Plataforma de conferência automática</span>
          <h1 className="hero__title">
            Compare arquivos e encontre divergências{' '}
            <span className="hero__title-accent">em segundos</span>
          </h1>
          <p className="hero__subtitle">
            Envie PDFs, planilhas, XMLs ou relatórios e receba uma análise clara com
            diferenças, itens faltantes, valores divergentes e relatório pronto para
            conferência.
          </p>

          <div className="hero__trust">
            {trustBadges.map(({ label, Icon }) => (
              <span key={label} className="hero__trust-item">
                <Icon />
                {label}
              </span>
            ))}
          </div>

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
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <strong>12+</strong>
              <span>formatos suportados</span>
            </div>
            <div className="hero__stat-divider" aria-hidden="true" />
            <div className="hero__stat">
              <strong>3s</strong>
              <span>tempo médio de análise</span>
            </div>
          </div>
        </div>

        <div id="upload" className="hero__upload">
          <UploadCard showToast={showToast} />
        </div>
      </div>
    </section>
  )
}

export default Hero
