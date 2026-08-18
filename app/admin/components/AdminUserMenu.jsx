'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOutAdmin } from '../actions'

export default function AdminUserMenu({ user }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="admin-user" ref={wrapRef}>
      <button
        type="button"
        className="admin-user__trigger"
        aria-label="Menu do usuário"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="admin-user__avatar" aria-hidden="true">
          {user.initials}
        </span>
        <span className="admin-user__meta">
          <strong>{user.name}</strong>
          <em>{user.roleLabel}</em>
        </span>
        <span className="admin-user__caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <div className="admin-user__menu" role="menu">
          <Link href="/admin/minha-conta" role="menuitem" onClick={() => setOpen(false)}>
            Minha conta
          </Link>
          <Link
            href="/admin/minha-conta#senha"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Alterar senha
          </Link>
          <form action={signOutAdmin}>
            <button type="submit" role="menuitem">
              Sair
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
