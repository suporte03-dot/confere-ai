'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { signOutAdmin } from '../actions'
import { ADMIN_COVER_SRC, ADMIN_LOGO_SRC } from '../../../src/lib/admin/account'
import { createClient } from '../../../src/lib/supabase/client'
import { buildStockAlertState } from '../../../src/lib/admin/stock'
import { getStockAlertsAction } from '../(protected)/alerts/actions'
import AdminUserMenu from './AdminUserMenu'
import { AdminIcon } from './AdminIcons'

const StockAlertsPanel = dynamic(() => import('../(protected)/StockAlertsPanel'), {
  ssr: false,
})

const EMPTY = buildStockAlertState([])

const NAV = [
  { href: '/admin', label: 'Visão Geral', icon: 'overview', exact: true },
  { href: '/admin/pedidos', label: 'Pedidos', icon: 'orders' },
  { href: '/admin/produtos', label: 'Produtos', icon: 'products' },
  { href: '/admin/categorias', label: 'Categorias', icon: 'categories' },
  { href: '/admin/colecoes', label: 'Coleções', icon: 'collections' },
  { href: '/admin/estoque', label: 'Estoque', icon: 'stock' },
  { href: '/admin/desempenho', label: 'Desempenho', icon: 'monitor' },
  { href: '/admin/configuracoes', label: 'Configurações', icon: 'settings' },
  { href: '/admin/minha-conta', label: 'Minha Conta', icon: 'account' },
  { href: '/admin/ajuda', label: 'Ajuda', icon: 'help' },
]

function sectionTitle(pathname) {
  if (pathname === '/admin') return 'Visão Geral'
  if (pathname.startsWith('/admin/pedidos')) return 'Pedidos'
  if (pathname.startsWith('/admin/produtos/novo')) return 'Novo produto'
  if (pathname.startsWith('/admin/produtos')) return 'Produtos'
  if (pathname.startsWith('/admin/categorias/novo')) return 'Nova categoria'
  if (pathname.startsWith('/admin/categorias')) return 'Categorias'
  if (pathname.startsWith('/admin/colecoes/novo')) return 'Nova coleção'
  if (pathname.startsWith('/admin/colecoes')) return 'Coleções'
  if (pathname.startsWith('/admin/estoque')) return 'Estoque'
  if (pathname.startsWith('/admin/desempenho')) return 'Desempenho'
  if (pathname.startsWith('/admin/configuracoes')) return 'Configurações'
  if (pathname.startsWith('/admin/minha-conta')) return 'Minha Conta'
  if (pathname.startsWith('/admin/ajuda')) return 'Ajuda'
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
      // Realtime is optional; refetch on focus remains as fallback.
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
            Terra & Estilo<em>Painel</em>
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
              <AdminIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__foot">
          <form action={signOutAdmin} className="admin-sidebar__signout">
            <button type="submit" className="admin-btn admin-btn--ghost">
              <AdminIcon name="logout" />
              Sair
            </button>
          </form>
        </div>
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
            <AdminIcon name="bell" className="admin-alert-bell__icon" />
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
            <div className="admin-hero__ornament" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="admin-hero__copy">
              <p className="admin-hero__hello">Olá, {user.name}.</p>
              <h1>Gestão Terra & Estilo</h1>
              <p>
                Produtos, estoque, pedidos e conteúdo da sua loja em um só lugar.
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
