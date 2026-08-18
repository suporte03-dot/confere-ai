'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAdmin } from '../actions'
import { ADMIN_COVER_SRC, ADMIN_LOGO_SRC } from '../../../src/lib/admin/account'
import StockAlertsPanel from '../(protected)/StockAlertsPanel'
import { createClient } from '../../../src/lib/supabase/client'
import { buildStockAlertState } from '../../../src/lib/admin/stock'
import { getStockAlertsAction } from '../(protected)/alerts/actions'
import AdminUserMenu from './AdminUserMenu'

const EMPTY = buildStockAlertState([])

const NAV = [
  { href: '/admin', label: 'Visão Geral', exact: true },
  { href: '/admin/produtos', label: 'Produtos' },
  { href: '/admin/categorias', label: 'Categorias' },
  { href: '/admin/colecoes', label: 'Coleções' },
  { href: '/admin/estoque', label: 'Estoque' },
  { href: '/admin/minha-conta', label: 'Minha Conta' },
]

function sectionTitle(pathname) {
  if (pathname === '/admin') return 'Visão Geral'
  if (pathname.startsWith('/admin/produtos/novo')) return 'Novo produto'
  if (pathname.startsWith('/admin/produtos')) return 'Produtos'
  if (pathname.startsWith('/admin/categorias/novo')) return 'Nova categoria'
  if (pathname.startsWith('/admin/categorias')) return 'Categorias'
  if (pathname.startsWith('/admin/colecoes/novo')) return 'Nova coleção'
  if (pathname.startsWith('/admin/colecoes')) return 'Coleções'
  if (pathname.startsWith('/admin/estoque')) return 'Estoque'
  if (pathname.startsWith('/admin/minha-conta')) return 'Minha Conta'
  return 'Painel'
}

function navActive(pathname, item) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export default function AdminShell({ user, initialAlerts, children }) {
  const pathname = usePathname() || '/admin'
  const [navOpen, setNavOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [state, setState] = useState(initialAlerts || EMPTY)
  const title = useMemo(() => sectionTitle(pathname), [pathname])
  const isHome = pathname === '/admin'

  const refresh = useCallback(async () => {
    const next = await getStockAlertsAction()
    if (next?.ok) {
      setState({
        alerts: next.alerts,
        grouped: next.grouped,
        summary: next.summary,
      })
    }
  }, [])

  useEffect(() => {
    setState(initialAlerts || EMPTY)
  }, [initialAlerts])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('admin-nav-open', navOpen)
    document.body.classList.toggle('admin-alerts-open', alertsOpen)
    return () => {
      document.body.classList.remove('admin-nav-open')
      document.body.classList.remove('admin-alerts-open')
    }
  }, [navOpen, alertsOpen])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setNavOpen(false)
        setAlertsOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    let supabase
    let channel
    try {
      supabase = createClient()
      channel = supabase
        .channel('admin-stock-alerts')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'product_variants' },
          () => refresh(),
        )
        .subscribe()
    } catch {
      // Realtime optional
    }
    return () => {
      window.removeEventListener('focus', onFocus)
      if (supabase && channel) supabase.removeChannel(channel)
    }
  }, [refresh])

  const count = state.summary?.total || 0

  return (
    <div className="admin-app">
      <button
        type="button"
        className={`admin-nav-overlay${navOpen ? ' is-open' : ''}`}
        aria-label="Fechar menu"
        tabIndex={navOpen ? 0 : -1}
        onClick={() => setNavOpen(false)}
      />

      <aside className={`admin-sidebar${navOpen ? ' is-open' : ''}`} aria-label="Menu administrativo">
        <Link href="/admin" className="admin-sidebar__brand">
          <img src={ADMIN_LOGO_SRC} alt="" width="44" height="44" />
          <span>
            Terra &amp; Estilo
            <em>Painel</em>
          </span>
        </Link>

        <nav className="admin-sidebar__nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navActive(pathname, item) ? 'is-active' : ''}
              aria-current={navActive(pathname, item) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={signOutAdmin} className="admin-sidebar__signout">
          <button type="submit" className="admin-btn admin-btn--ghost">
            Sair
          </button>
        </form>
      </aside>

      <div className="admin-stage">
        <header className="admin-header">
          <button
            type="button"
            className="admin-header__menu"
            aria-label="Abrir menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <img className="admin-header__logo" src={ADMIN_LOGO_SRC} alt="" />
          <p className="admin-header__title">{title}</p>
          <button
            type="button"
            className={`admin-alert-bell${count ? ' has-alerts' : ''}`}
            aria-label={
              count ? `Alertas de estoque, ${count} pendentes` : 'Alertas de estoque'
            }
            aria-expanded={alertsOpen}
            onClick={() => setAlertsOpen((v) => !v)}
          >
            <span className="admin-alert-bell__icon" aria-hidden="true">
              🔔
            </span>
            {count > 0 ? <em className="admin-alert-bell__badge">{count}</em> : null}
          </button>
          <AdminUserMenu user={user} />
        </header>

        {isHome ? (
          <section
            className="admin-hero"
            style={{ '--admin-hero-image': `url("${ADMIN_COVER_SRC}")` }}
          >
            <div className="admin-hero__shade" aria-hidden="true" />
            <img className="admin-hero__logo" src={ADMIN_LOGO_SRC} alt="Terra & Estilo" />
            <div className="admin-hero__copy">
              <p className="admin-hero__hello">Olá, {user.name}.</p>
              <h1>Gestão Terra &amp; Estilo</h1>
              <p>
                Produtos, estoque, coleções e conteúdo da sua loja em um só lugar.
              </p>
              <span>Bem-vindo ao painel administrativo.</span>
            </div>
          </section>
        ) : null}

        <div className="admin-content">{children}</div>
      </div>

      <StockAlertsPanel
        open={alertsOpen}
        grouped={state.grouped}
        summary={state.summary}
        onClose={() => setAlertsOpen(false)}
      />
    </div>
  )
}
