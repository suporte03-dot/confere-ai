import { redirect } from 'next/navigation'
import { getAdminAccess } from '../../../src/lib/supabase/admin-auth'
import { fetchStockAlerts } from '../../../src/lib/admin/stock-alerts'
import { signOutAdmin } from '../actions'
import AdminChrome from './AdminChrome'

export const dynamic = 'force-dynamic'

export default async function AdminProtectedLayout({ children }) {
  const { user, allowed } = await getAdminAccess()

  if (!user) {
    redirect('/admin/login')
  }

  if (!allowed) {
    return (
      <div className="admin-shell">
        <p className="admin-brand">
          Terra &amp; <span>Estilo</span>
        </p>
        <p className="admin-kicker">Área administrativa</p>
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>
            Sua conta está autenticada, mas não possui permissão de administrador
            (role <code>admin</code> ou <code>owner</code> em <code>profiles</code>).
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

  const alerts = await fetchStockAlerts()

  return <AdminChrome initialAlerts={alerts}>{children}</AdminChrome>
}
