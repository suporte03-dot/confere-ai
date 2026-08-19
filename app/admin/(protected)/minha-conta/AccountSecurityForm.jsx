'use client'

import { useMemo, useState } from 'react'
import { createClient } from '../../../../src/lib/supabase/client'
import { initialsFromName, passwordStrength } from '../../../../src/lib/admin/account'
import { signOutAdmin } from '../../actions'
import { AdminIcon } from '../../components/AdminIcons'

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
  const initials = initialsFromName(displayName || name, email)

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
      <article className="admin-account-summary">
        <span className="admin-account-summary__avatar" aria-hidden="true">
          {initials}
        </span>
        <div className="admin-account-summary__field">
          <span>Nome completo</span>
          <strong>{displayName || name}</strong>
        </div>
        <div className="admin-account-summary__field">
          <span>E-mail</span>
          <strong>{email}</strong>
        </div>
        <div className="admin-account-summary__field">
          <span>Tipo de acesso</span>
          <strong>{roleLabel}</strong>
        </div>
        <div className="admin-account-status">
          <strong>
            <AdminIcon name="shield" />
            Conta ativa
          </strong>
          Acesso liberado
        </div>
      </article>

      <div className="admin-account-grid">
        <div>
          <form className="admin-form admin-account-card" onSubmit={onSaveName}>
            <h2>Dados da conta</h2>
            <div className="admin-field">
              <label htmlFor="account-name">Nome de exibição</label>
              <input
                id="account-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={pending}
              />
            </div>
            {nameError ? <p className="admin-error">{nameError}</p> : null}
            {nameMessage ? <p className="admin-success">{nameMessage}</p> : null}
            <button className="admin-btn" type="submit" disabled={pending}>
              Salvar nome
              <AdminIcon name="arrow" />
            </button>
          </form>

          <form className="admin-form admin-account-card" id="senha" onSubmit={onChangePassword}>
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
                  <AdminIcon name="eye" />
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
              <div className="admin-password-wrap">
                <input
                  id="account-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={pending}
                />
                <button
                  type="button"
                  className="admin-link-btn"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <AdminIcon name="eye" />
                </button>
              </div>
            </div>
            {passwordError ? <p className="admin-error">{passwordError}</p> : null}
            {passwordMessage ? (
              <p className="admin-success">{passwordMessage}</p>
            ) : null}
            <button className="admin-btn" type="submit" disabled={pending}>
              <AdminIcon name="lock" />
              Alterar senha
            </button>
          </form>
        </div>

        <aside>
          <section className="admin-account-card">
            <h2>Segurança da conta</h2>
            <div className="admin-account-note">
              <h3>
                <AdminIcon name="shield" />
                Proteja sua conta
              </h3>
              <p>
                Use uma senha exclusiva para o painel e evite reaproveitar credenciais de outros
                sistemas.
              </p>
            </div>
            <div className="admin-account-note">
              <h3>
                <AdminIcon name="monitor" />
                Sessões ativas
              </h3>
              <p>
                Esta sessão permanece válida neste navegador até você sair ou alterar a senha.
              </p>
            </div>
            <p className="admin-account-alert">
              <AdminIcon name="lock" />
              Não compartilhe e-mail e senha do painel. Cada acesso deve ser individual.
            </p>
          </section>
          <form action={signOutAdmin}>
            <button type="submit" className="admin-btn admin-btn--danger-ghost">
              <AdminIcon name="logout" />
              Sair da conta
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
