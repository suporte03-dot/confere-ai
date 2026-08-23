import AdminPageHeader from '../../components/AdminPageHeader'
import HelpHubClient from '../../components/help/HelpHubClient'
import HelpButton from '../../components/help/HelpButton'
import { AdminIcon } from '../../components/AdminIcons'

export const dynamic = 'force-dynamic'

export default function AdminHelpPage() {
  return (
    <>
      <AdminPageHeader
        title="Ajuda"
        description="Central de orientação do painel Terra & Estilo — encontre como usar cada módulo."
        actions={<HelpButton topic="faq" showFirstVisit={false} />}
      />
      <p className="admin-help-intro">
        <AdminIcon name="help" />
        Use a busca ou escolha um módulo. Em qualquer tela, o botão “Ajuda” abre só o conteúdo da
        página atual.
      </p>
      <HelpHubClient />
    </>
  )
}
