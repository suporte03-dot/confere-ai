'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../src/lib/supabase/client'
import { passwordStrength } from '../../../src/lib/admin/account'

export default function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const strength = useMemo(() => passwordStrength(password), [password])

  useEffect(() => {
    const supabase = createClient()
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session?.user?.recovery_sent_at) setReady(true)
    })

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('A confirmação não coincide com a nova senha.')
      return
    }
    setPending(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError('Não foi possível definir a nova senha. Solicite um novo link.')
        return
      }
      setMessage('Senha alterada com sucesso.')
      window.setTimeout(() => router.replace('/admin/login'), 1200)
    } catch {
      setError('Não foi possível definir a nova senha.')
    } finally {
      setPending(false)
    }
  }

  return (
    <>
        <p className="admin-login__eyebrow">Terra &amp; Estilo</p>
        <h1>Nova senha</h1>
        <p className="admin-login__lead">Defina uma senha nova para voltar ao painel.</p>
        {!ready ? (
          <p className="admin-muted">
            Abra o link enviado por e-mail para continuar. Se o link expirou, solicite outro.
          </p>
        ) : (
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="reset-password">Nova senha</label>
              <div className="admin-password-wrap">
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={pending}
                />
                <button
                  type="button"
                  className="admin-link-btn"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {password ? (
                <span className={`admin-strength admin-strength--${strength.score}`}>
                  Segurança: {strength.label}
                </span>
              ) : null}
            </div>
            <div className="admin-field">
              <label htmlFor="reset-confirm">Confirmar nova senha</label>
              <input
                id="reset-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={pending}
              />
            </div>
            {error ? <p className="admin-error">{error}</p> : null}
            {message ? <p className="admin-success">{message}</p> : null}
            <button className="admin-btn" type="submit" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar senha'}
            </button>
          </form>
        )}
        <Link href="/admin/login" className="admin-text-link">
          Voltar ao login
        </Link>
    </>
  )
}
