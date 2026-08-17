'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '../../../src/lib/supabase/client'
import { buildStockAlertState } from '../../../src/lib/admin/stock'
import { getStockAlertsAction } from './alerts/actions'
import StockAlertsPanel from './StockAlertsPanel'

const EMPTY = buildStockAlertState([])

export default function AdminChrome({ initialAlerts, children }) {
  const [state, setState] = useState(initialAlerts || EMPTY)
  const [open, setOpen] = useState(false)

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
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('admin-alerts-open', open)
    return () => document.body.classList.remove('admin-alerts-open')
  }, [open])

  useEffect(() => {
    const onFocus = () => {
      refresh()
    }
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
          () => {
            refresh()
          },
        )
        .subscribe()
    } catch {
      // Realtime unavailable — focus refetch still covers the session.
    }

    return () => {
      window.removeEventListener('focus', onFocus)
      if (supabase && channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [refresh])

  const count = state.summary?.total || 0

  return (
    <div className="admin-chrome">
      <div className="admin-chrome__bar">
        <p className="admin-chrome__label">Painel Terra &amp; Estilo</p>
        <button
          type="button"
          className={`admin-alert-bell${count ? ' has-alerts' : ''}`}
          aria-label={
            count
              ? `Alertas de estoque, ${count} pendentes`
              : 'Alertas de estoque'
          }
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="admin-alert-bell__icon" aria-hidden="true">
            🔔
          </span>
          {count > 0 ? <em className="admin-alert-bell__badge">{count}</em> : null}
        </button>
      </div>

      <StockAlertsPanel
        open={open}
        grouped={state.grouped}
        summary={state.summary}
        onClose={() => setOpen(false)}
      />

      {children}
    </div>
  )
}
