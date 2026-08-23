import { getAdminAccess } from '../../../../src/lib/supabase/admin-auth'
import { buildAdminUser } from '../../../../src/lib/admin/account'
import AdminPageHeader from '../../components/AdminPageHeader'
import HelpButton from '../../components/help/HelpButton'
import AccountSecurityForm from './AccountSecurityForm'

export const dynamic = 'force-dynamic'

export default async function AdminAccountPage() {
  const { user, profile } = await getAdminAccess()
  const account = buildAdminUser(user, profile)

  return (
    <>
      <AdminPageHeader
        title="Minha conta"
        description="Dados da sua sessão e alteração de senha."
        actions={<HelpButton topic="minha-conta" />}
      />
      <AccountSecurityForm
        email={account.email}
        name={account.name}
        roleLabel={account.roleLabel}
      />
    </>
  )
}
