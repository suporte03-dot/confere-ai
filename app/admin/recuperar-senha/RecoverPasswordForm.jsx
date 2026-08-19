'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../src/lib/supabase/client'

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const origin = window.location.origin
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${origin}/admin/redefinir-senha` },
      )
      if (resetError) {
        setError('Não foi possível enviar o e-mail de recuperação.')
        return
      }
      setSent(true)
    } catch {
      setError('Não foi possível enviar o e-mail de recuperação.')
    } finally {
      setPending(false)
    }
  }

  return (
    <>
        <p className="admin-login__eyebrow">Terra &amp; Estilo</p>
        <h1>Esqueci minha senha</h1>
        <p className="admin-login__lead">
          Informe o e-mail da conta administrativa. Se ele existir, enviaremos um link seguro.
        </p>
        {sent ? (
          <p className="admin-success">
            Se o e-mail estiver cadastrado, você receberá as instruções em instantes.
          </p>
        ) : (
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="admin-field">
              <label htmlFor="recover-email">E-mail</label>
              <input
                id="recover-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
              />
            </div>
            {error ? <p className="admin-error">{error}</p> : null}
            <button className="admin-btn" type="submit" disabled={pending}>
              {pending ? 'Enviando…' : 'Enviar link'}
            </button>
          </form>
        )}
        <Link href="/admin/login" className="admin-text-link">
          Voltar ao login
        </Link>
    </>
  )
}
