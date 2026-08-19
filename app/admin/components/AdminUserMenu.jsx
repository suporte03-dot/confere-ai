'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signOutAdmin } from '../actions'
import { AdminIcon } from './AdminIcons'

export default function AdminUserMenu({ user }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        wrapRef.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    menuRef.current?.querySelector('a, button')?.focus()
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
        aria-label={`Menu do usuário, ${user.name}`}
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
        <AdminIcon name="chevron" className="admin-user__caret" />
      </button>
      {open ? (
        <div className="admin-user__menu" role="menu" ref={menuRef}>
          <Link href="/admin/minha-conta" role="menuitem" onClick={() => setOpen(false)}>
            Minha Conta
          </Link>
          <Link
            href="/admin/minha-conta#senha"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Alterar senha
          </Link>
          <hr className="admin-user__sep" />
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
