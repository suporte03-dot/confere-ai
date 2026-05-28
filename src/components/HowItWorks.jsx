import { steps } from '../data/mockData'
import { IconUpload, IconExport, IconCheck, IconShield } from './icons/FeatureIcons'

const stepIcons = [IconUpload, IconShield, IconCheck, IconExport]

function HowItWorks() {
  return (
    <section id="como-funciona" className="section how-it-works">
      <div className="container">
        <div className="section__header">
          <span className="badge badge--cyan">Como funciona</span>
          <h2 className="section__title">Quatro passos para uma conferência completa</h2>
          <p className="section__subtitle">
            Do upload ao relatório final em poucos cliques — sem planilhas manuais.
          </p>
        </div>

        <div className="steps">
          <div className="steps__line" aria-hidden="true" />
          {steps.map((step, index) => {
            const StepIcon = stepIcons[index]
            return (
              <article key={step.number} className="step-card">
                <div className="step-card__top">
                  <div className="step-card__number">{step.number}</div>
                  <div className="step-card__icon-wrap">
                    <StepIcon />
                  </div>
                </div>
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__description">{step.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
