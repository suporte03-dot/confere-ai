'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInAdmin } from '../actions'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [denied, setDenied] = useState(false)
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setDenied(false)
    setPending(true)

    try {
      const result = await signInAdmin(email, password)
      if (result?.denied) {
        setDenied(true)
        return
      }
      if (!result?.ok) {
        setError(result?.error || 'Erro inesperado ao autenticar. Tente novamente.')
        return
      }
      router.replace('/admin')
      router.refresh()
    } catch (error) {
      console.error(error)
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
        <div className="admin-password-wrap">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
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
      <Link href="/admin/recuperar-senha" className="admin-text-link">
        Esqueci minha senha
      </Link>
    </form>
  )
}
