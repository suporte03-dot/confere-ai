import Link from 'next/link'
import { getHelpTopic } from '../../../../src/content/adminHelp'
import { AdminIcon } from '../../components/AdminIcons'
import HelpTopicSections from '../../components/help/HelpTopicSections'
import AdminPageHeader from '../../components/AdminPageHeader'

export default function HelpTopicView({ topicId }) {
  const topic = getHelpTopic(topicId)

  if (!topic) {
    return (
      <>
        <AdminPageHeader title="Tópico não encontrado" />
        <p className="admin-error">Este tópico de ajuda não existe ou foi movido.</p>
        <Link href="/admin/ajuda" className="admin-btn">
          Voltar à central de ajuda
        </Link>
      </>
    )
  }

  return (
    <>
      <AdminPageHeader
        title={topic.title}
        description="Documentação completa deste módulo do painel."
        actions={
          <Link href="/admin/ajuda" className="admin-btn admin-btn--ghost">
            <AdminIcon name="help" />
            Central de ajuda
          </Link>
        }
      />
      <article className="admin-help-doc admin-panel">
        <HelpTopicSections topic={topic} />
        {!topic.comingSoon && topic.id !== 'faq' && topic.id !== 'overview' ? (
          <p className="admin-help-doc__goto">
            <Link href={moduleHref(topic.id)} className="admin-btn">
              Ir para {topic.title}
              <AdminIcon name="arrow" />
            </Link>
          </p>
        ) : null}
        {topic.id === 'overview' ? (
          <p className="admin-help-doc__goto">
            <Link href="/admin" className="admin-btn">
              Ir para Visão Geral
              <AdminIcon name="arrow" />
            </Link>
          </p>
        ) : null}
      </article>
    </>
  )
}

function moduleHref(topicId) {
  const map = {
    produtos: '/admin/produtos',
    categorias: '/admin/categorias',
    colecoes: '/admin/colecoes',
    estoque: '/admin/estoque',
    pedidos: '/admin/pedidos',
    configuracoes: '/admin/configuracoes',
    'minha-conta': '/admin/minha-conta',
  }
  return map[topicId] || '/admin'
}
