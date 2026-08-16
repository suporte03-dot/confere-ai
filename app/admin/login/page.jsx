import { redirect } from 'next/navigation'
import { getAdminAccess } from '../../../src/lib/supabase/admin-auth'
import { signOutAdmin } from '../actions'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const { user, allowed } = await getAdminAccess()

  if (user && allowed) {
    redirect('/admin')
  }

  return (
    <div className="admin-shell">
      <p className="admin-brand">
        Terra &amp; <span>Estilo</span>
      </p>
      <p className="admin-kicker">Área administrativa</p>

      <section className="admin-panel">
        <h1>Entrar</h1>
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
          <>
            <p>Acesso restrito a contas com perfil admin ou owner.</p>
            <LoginForm />
          </>
        )}
      </section>
    </div>
  )
}
