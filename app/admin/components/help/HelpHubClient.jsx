'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { listHelpTopics, searchHelp } from '../../../../src/content/adminHelp'
import { AdminIcon } from '../AdminIcons'

export default function HelpHubClient() {
  const [query, setQuery] = useState('')
  const all = useMemo(() => listHelpTopics(), [])
  const results = useMemo(() => searchHelp(query), [query])

  return (
    <div className="admin-help-hub">
      <label className="admin-help-hub__search">
        <span className="admin-help-hub__search-icon" aria-hidden="true">
          <AdminIcon name="search" />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar na ajuda"
          aria-label="Buscar na ajuda"
        />
      </label>

      {!results.length ? (
        <p className="admin-empty">
          Nenhum resultado para “{query}”. Tente palavras como pix, estoque ou pedido.
        </p>
      ) : (
        <ul className="admin-help-hub__grid" aria-label="Tópicos de ajuda">
          {results.map((topic) => (
            <li key={topic.id}>
              <Link href={topic.href} className="admin-help-hub__card">
                <span className="admin-help-hub__card-icon" aria-hidden="true">
                  <AdminIcon name={topic.icon} />
                </span>
                <div>
                  <strong>
                    {topic.menuLabel}
                    {topic.comingSoon ? <em> Em breve</em> : null}
                  </strong>
                  <p>{topic.description}</p>
                </div>
                <AdminIcon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!query ? (
        <p className="admin-help-hub__hint">
          <AdminIcon name="info" />
          Em cada tela do ADM, use o botão “Ajuda” no canto superior direito para orientação
          contextual. Há {all.length} tópicos na documentação.
        </p>
      ) : null}
    </div>
  )
}
