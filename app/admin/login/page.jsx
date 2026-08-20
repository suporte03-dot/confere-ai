import { redirect } from 'next/navigation'
import { getAdminAccess } from '../../../src/lib/supabase/admin-auth'
import { getSupabaseEnvHealth } from '../../../src/lib/supabase/env'
import { signOutAdmin } from '../actions'
import AdminAuthLayout from '../components/AdminAuthLayout'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const { user, allowed } = await getAdminAccess()
  const envHealth = getSupabaseEnvHealth()

  if (user && allowed) {
    redirect('/admin')
  }

  return (
    <AdminAuthLayout>
      <p className="admin-login__eyebrow">Terra &amp; Estilo</p>
      <h1>Área administrativa</h1>
      <p className="admin-login__lead">Gerencie sua loja com simplicidade.</p>
      {!envHealth.resolvedUrl || !envHealth.resolvedKey ? (
        <p className="admin-error" role="status">
          Ambiente sem chave Supabase utilizável neste deploy. Confira as variáveis
          Preview na Vercel (URL + publishable/anon) e faça redeploy.
        </p>
      ) : null}
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
