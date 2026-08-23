/**
 * Shared help section markup (server-safe).
 * @param {{ topic: object, compact?: boolean }} props
 */
export default function HelpTopicSections({ topic, compact = false }) {
  if (!topic) return null

  return (
    <div className={`admin-help-sections${compact ? ' admin-help-sections--compact' : ''}`}>
      {topic.comingSoon ? (
        <p className="admin-help-badge" role="status">
          Módulo em breve no menu — orientação disponível abaixo.
        </p>
      ) : null}

      <section>
        <h3>O que é esta página</h3>
        <p>{topic.description}</p>
      </section>

      {topic.actions?.length ? (
        <section>
          <h3>O que você pode fazer aqui</h3>
          <ul>
            {topic.actions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {topic.steps?.length ? (
        <section>
          <h3>Como utilizar</h3>
          <ol>
            {topic.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {topic.faq?.length ? (
        <section>
          <h3>Dúvidas comuns</h3>
          <dl className="admin-help-faq">
            {topic.faq.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  )
}
