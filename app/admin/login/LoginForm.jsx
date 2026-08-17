'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../src/lib/supabase/client'
import { isAdminRole } from '../../../src/lib/supabase/roles'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [denied, setDenied] = useState(false)
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setDenied(false)
    setPending(true)

    try {
      const supabase = createClient()
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (signInError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('SUPABASE_LOGIN_ERROR', {
            code: signInError.code,
            message: signInError.message,
            status: signInError.status,
          })
        }
        setError('Não foi possível entrar. Verifique e-mail e senha.')
        return
      }

      const user = signInData.user
      if (!user) {
        setError('Sessão inválida após o login.')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError || !profile || !isAdminRole(profile.role)) {
        setDenied(true)
        await supabase.auth.signOut()
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Erro inesperado ao autenticar. Tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <div className="admin-field">
        <label htmlFor="admin-email">E-mail</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="admin-password">Senha</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending}
        />
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {denied ? (
        <p className="admin-error">
          Acesso negado. Esta conta não tem perfil de administrador.
        </p>
      ) : null}

      <button className="admin-btn" type="submit" disabled={pending}>
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
