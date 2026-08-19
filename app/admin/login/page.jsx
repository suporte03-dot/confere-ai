import { redirect } from 'next/navigation'
import { getAdminAccess } from '../../../src/lib/supabase/admin-auth'
import { signOutAdmin } from '../actions'
import AdminAuthLayout from '../components/AdminAuthLayout'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const { user, allowed } = await getAdminAccess()

  if (user && allowed) {
    redirect('/admin')
  }

  return (
    <AdminAuthLayout>
      <p className="admin-login__eyebrow">Terra &amp; Estilo</p>
      <h1>Área administrativa</h1>
      <p className="admin-login__lead">Gerencie sua loja com simplicidade.</p>
      {user && !allowed ? (
        <>
          <p className="admin-error">
            Acesso negado. Sua sessão não tem permissão de administrador.
          </p>
          <div className="admin-actions">
            <form action={signOutAdmin}>
              <button type="submit" className="admin-btn admin-btn--ghost">
                Sair
              </button>
            </form>
          </div>
        </>
      ) : (
        <LoginForm />
      )}
      <p className="admin-login__foot">Ambiente seguro e restrito.</p>
    </AdminAuthLayout>
  )
}
