import { steps } from '../data/mockData'
import { IconUpload, IconShield, IconCheck, IconExport } from './icons/FeatureIcons'

const stepIcons = [IconUpload, IconShield, IconCheck, IconExport]

function HowItWorks() {
  return (
    <section id="como-funciona" className="section timeline">
      <div className="container">
        <div className="section__header">
          <span className="eyebrow eyebrow--cyan">Como funciona</span>
          <h2 className="section__title">Da importação ao relatório em quatro passos</h2>
          <p className="section__subtitle">
            Um fluxo claro, rápido e preparado para rotinas fiscais, contábeis e financeiras.
          </p>
        </div>

        <div className="timeline__track">
          <div className="timeline__line" aria-hidden="true" />
          {steps.map((step, index) => {
            const StepIcon = stepIcons[index]
            return (
              <article key={step.number} className="timeline__step">
                <div className="timeline__marker">
                  <span className="timeline__number">{step.number}</span>
                  <span className="timeline__icon">
                    <StepIcon />
                  </span>
                </div>
                <h3 className="timeline__title">{step.title}</h3>
                <p className="timeline__desc">{step.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
