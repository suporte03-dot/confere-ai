import UploadCard from './UploadCard'
import { IconCheck, IconShield, IconSpark } from './icons/FeatureIcons'

const trustBadges = [
  { label: 'Sem conferência manual', Icon: IconCheck },
  { label: 'Relatório exportável', Icon: IconShield },
  { label: 'Análise inteligente', Icon: IconSpark },
]

function Hero({ showToast }) {
  return (
    <section id="inicio" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__mesh" />
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">Conferência inteligente para dados fiscais e financeiros</span>
          <h1 className="hero__title">
            Compare arquivos e encontre divergências{' '}
            <span className="text-gradient">em segundos</span>
          </h1>
          <p className="hero__subtitle">
            Envie PDFs, planilhas, XMLs e relatórios. O ConfereAI cruza os dados, identifica
            diferenças, encontra faltantes e entrega uma visão clara para conferência.
          </p>

          <div className="hero__trust">
            {trustBadges.map(({ label, Icon }) => (
              <span key={label} className="chip">
                <Icon />
                {label}
              </span>
            ))}
          </div>

          <div className="hero__actions">
            <a href="#upload" className="btn btn--primary btn--lg">
              Iniciar conferência
            </a>
            <a href="#exemplos" className="btn btn--outline btn--lg">
              Ver exemplos
            </a>
          </div>

          <div className="hero__metrics">
            <div className="metric">
              <strong>98%</strong>
              <span>precisão</span>
            </div>
            <div className="metric">
              <strong>12+</strong>
              <span>formatos</span>
            </div>
            <div className="metric">
              <strong>3s</strong>
              <span>por análise</span>
            </div>
          </div>
        </div>

        <div id="upload" className="hero__panel">
          <UploadCard showToast={showToast} />
        </div>
      </div>
    </section>
  )
}

export default Hero
