'use client'

import { useMemo, useState } from 'react'
import { createClient } from '../../../../src/lib/supabase/client'
import { passwordStrength } from '../../../../src/lib/admin/account'

export default function AccountSecurityForm({ email, name, roleLabel }) {
  const [displayName, setDisplayName] = useState(name)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [nameMessage, setNameMessage] = useState('')
  const [nameError, setNameError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const strength = useMemo(() => passwordStrength(password), [password])

  async function onSaveName(event) {
    event.preventDefault()
    setNameError('')
    setNameMessage('')
    const next = displayName.trim()
    if (!next) {
      setNameError('Informe um nome para exibição.')
      return
    }
    setPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: { full_name: next },
      })
      if (error) {
        setNameError('Não foi possível atualizar o nome.')
        return
      }
      setNameMessage('Nome atualizado.')
    } catch {
      setNameError('Não foi possível atualizar o nome.')
    } finally {
      setPending(false)
    }
  }

  async function onChangePassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    if (password.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setPasswordError('A confirmação não coincide com a nova senha.')
      return
    }
    setPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setPasswordError('Não foi possível alterar a senha. Tente novamente.')
        return
      }
      setPassword('')
      setConfirm('')
      setPasswordMessage('Senha alterada com sucesso.')
    } catch {
      setPasswordError('Não foi possível alterar a senha. Tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="admin-account">
      <form className="admin-form" onSubmit={onSaveName}>
        <div className="admin-field">
          <label htmlFor="account-name">Nome</label>
          <input
            id="account-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={pending}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="account-email">E-mail</label>
          <input id="account-email" value={email} readOnly disabled />
        </div>
        <div className="admin-field">
          <label htmlFor="account-role">Tipo de acesso</label>
          <input id="account-role" value={roleLabel} readOnly disabled />
        </div>
        {nameError ? <p className="admin-error">{nameError}</p> : null}
        {nameMessage ? <p className="admin-success">{nameMessage}</p> : null}
        <button className="admin-btn" type="submit" disabled={pending}>
          Salvar nome
        </button>
      </form>

      <form className="admin-form" id="senha" onSubmit={onChangePassword}>
        <h2>Alterar senha</h2>
        <div className="admin-field">
          <label htmlFor="account-password">Nova senha</label>
          <div className="admin-password-wrap">
            <input
              id="account-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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
          <label htmlFor="account-confirm">Confirmar nova senha</label>
          <input
            id="account-confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={pending}
          />
        </div>
        {passwordError ? <p className="admin-error">{passwordError}</p> : null}
        {passwordMessage ? (
          <p className="admin-success">{passwordMessage}</p>
        ) : null}
        <button className="admin-btn" type="submit" disabled={pending}>
          Alterar senha
        </button>
      </form>
    </div>
  )
}
