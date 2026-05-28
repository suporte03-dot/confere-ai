import { steps } from '../data/mockData'

function HowItWorks() {
  return (
    <section id="como-funciona" className="section how-it-works">
      <div className="container">
        <div className="section__header">
          <span className="badge">Como funciona</span>
          <h2 className="section__title">Quatro passos para uma conferência completa</h2>
          <p className="section__subtitle">
            Do upload ao relatório final em poucos cliques — sem planilhas manuais.
          </p>
        </div>

        <div className="steps">
          {steps.map((step, index) => (
            <article key={step.number} className="step-card">
              <div className="step-card__number">{step.number}</div>
              {index < steps.length - 1 && (
                <div className="step-card__connector" aria-hidden="true" />
              )}
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__description">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
