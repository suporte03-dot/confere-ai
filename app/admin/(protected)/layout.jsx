import { redirect } from 'next/navigation'
import { getAdminAccess } from '../../../src/lib/supabase/admin-auth'
import { fetchAdminAlerts } from '../../../src/lib/admin/alerts'
import { buildAdminUser } from '../../../src/lib/admin/account'
import { signOutAdmin } from '../actions'
import AdminShell from '../components/AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminProtectedLayout({ children }) {
  const { user, profile, allowed } = await getAdminAccess()

  if (!user) {
    redirect('/admin/login')
  }

  if (!allowed) {
    return (
      <div className="admin-login admin-login--simple">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>
            Sua conta está autenticada, mas não possui permissão de administrador.
          </p>
          <div className="admin-actions">
            <form action={signOutAdmin}>
              <button type="submit" className="admin-btn admin-btn--ghost">
                Sair
              </button>
            </form>
          </div>
        </section>
      </div>
    )
  }

  const alerts = await fetchAdminAlerts()
  const adminUser = buildAdminUser(user, profile)

  return (
    <AdminShell user={adminUser} initialAlerts={alerts}>
      {children}
    </AdminShell>
  )
}
