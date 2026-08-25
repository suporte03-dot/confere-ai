'use client'

import { useMemo, useState } from 'react'
import { formatBRL } from '../../../../src/lib/admin/format'
import { orderStatusLabel } from '../../../../src/lib/orders/status'

const STATUS_ORDER = [
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const STATUS_COLORS = {
  pending_payment: '#c5a059',
  paid: '#2d6a3a',
  processing: '#8a6a2f',
  shipped: '#3d5a80',
  delivered: '#1f3d2b',
  cancelled: '#8a4a3a',
  expired: '#6b635a',
}

function formatAxisDay(dateKey) {
  if (!dateKey) return ''
  const [, m, d] = dateKey.split('-')
  return `${d}/${m}`
}

function formatCompactBRL(value) {
  const n = Number(value) || 0
  if (n >= 1000) {
    return `R$ ${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`
  }
  return formatBRL(n)
}

export function RevenueChart({ series = [], emptyMessage }) {
  const [mode, setMode] = useState('revenue')
  const points = useMemo(() => {
    return (series || []).map((row) => ({
      ...row,
      value: mode === 'orders' ? row.orders : row.revenue,
    }))
  }, [series, mode])

  const max = Math.max(...points.map((p) => p.value), 0)
  const hasData = points.some((p) => p.value > 0)

  const width = 640
  const height = 220
  const padX = 36
  const padY = 24
  const innerW = width - padX * 2
  const innerH = height - padY * 2

  const coords = points.map((point, index) => {
    const x =
      points.length <= 1
        ? padX + innerW / 2
        : padX + (index / (points.length - 1)) * innerW
    const y =
      max <= 0 ? padY + innerH : padY + innerH - (point.value / max) * innerH
    return { ...point, x, y }
  })

  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${padY + innerH} L ${coords[0].x} ${padY + innerH} Z`
      : ''

  const labelStep = Math.max(1, Math.ceil(coords.length / 7))

  return (
    <div className="admin-perf-chart">
      <div className="admin-perf-chart__head">
        <h2>Faturamento por dia</h2>
        <div className="admin-perf-chart__toggle" role="group" aria-label="Métrica do gráfico">
          <button
            type="button"
            className={mode === 'revenue' ? 'is-active' : undefined}
            onClick={() => setMode('revenue')}
          >
            Faturamento
          </button>
          <button
            type="button"
            className={mode === 'orders' ? 'is-active' : undefined}
            onClick={() => setMode('orders')}
          >
            Pedidos
          </button>
        </div>
      </div>

      {!hasData ? (
        <p className="admin-perf-empty">{emptyMessage || 'Ainda não há vendas neste período.'}</p>
      ) : (
        <>
          <svg
            className="admin-perf-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={
              mode === 'orders'
                ? 'Gráfico de pedidos pagos por dia'
                : 'Gráfico de faturamento por dia'
            }
          >
            <defs>
              <linearGradient id="perfArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(197, 160, 89, 0.35)" />
                <stop offset="100%" stopColor="rgba(197, 160, 89, 0.02)" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padY + innerH * (1 - ratio)
              return (
                <line
                  key={ratio}
                  x1={padX}
                  x2={width - padX}
                  y1={y}
                  y2={y}
                  className="admin-perf-chart__grid"
                />
              )
            })}
            <path d={areaPath} fill="url(#perfArea)" />
            <path d={linePath} className="admin-perf-chart__line" fill="none" />
            {coords.map((point) => (
              <circle
                key={point.date}
                cx={point.x}
                cy={point.y}
                r="3.2"
                className="admin-perf-chart__dot"
              >
                <title>
                  {formatAxisDay(point.date)} —{' '}
                  {mode === 'orders'
                    ? `${point.orders} pedido(s)`
                    : formatBRL(point.revenue)}
                </title>
              </circle>
            ))}
            {coords.map((point, index) =>
              index % labelStep === 0 || index === coords.length - 1 ? (
                <text
                  key={`label-${point.date}`}
                  x={point.x}
                  y={height - 6}
                  textAnchor="middle"
                  className="admin-perf-chart__label"
                >
                  {formatAxisDay(point.date)}
                </text>
              ) : null,
            )}
            <text x={padX} y={16} className="admin-perf-chart__label">
              {mode === 'orders' ? max : formatCompactBRL(max)}
            </text>
          </svg>
        </>
      )}
    </div>
  )
}

export function StatusChart({ byStatus = {}, emptyMessage }) {
  const rows = STATUS_ORDER.map((key) => ({
    key,
    label: orderStatusLabel(key),
    value: Number(byStatus[key]) || 0,
    color: STATUS_COLORS[key],
  }))
  const total = rows.reduce((sum, row) => sum + row.value, 0)

  if (!total) {
    return (
      <div className="admin-perf-chart">
        <div className="admin-perf-chart__head">
          <h2>Pedidos por status</h2>
        </div>
        <p className="admin-perf-empty">
          {emptyMessage || 'Ainda não há pedidos neste período.'}
        </p>
      </div>
    )
  }

  const segments = rows
    .filter((row) => row.value > 0)
    .reduce((acc, row) => {
      const pct = (row.value / total) * 100
      const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].pct : 0
      acc.push({ ...row, pct, offset })
      return acc
    }, [])

  return (
    <div className="admin-perf-chart">
      <div className="admin-perf-chart__head">
        <h2>Pedidos por status</h2>
      </div>
      <div className="admin-perf-donut" aria-hidden="true">
        <div
          className="admin-perf-donut__ring"
          style={{
            background: `conic-gradient(${segments
              .map(
                (seg) =>
                  `${seg.color} ${seg.offset}% ${seg.offset + seg.pct}%`,
              )
              .join(', ')})`,
          }}
        />
        <div className="admin-perf-donut__center">
          <strong>{total}</strong>
          <span>pedidos</span>
        </div>
      </div>
      <ul className="admin-perf-legend">
        {rows.map((row) => (
          <li key={row.key}>
            <span style={{ background: row.color }} />
            <em>{row.label}</em>
            <strong>{row.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CategoryBars({ rows = [], emptyMessage }) {
  const max = Math.max(...rows.map((row) => row.revenue), 0)

  return (
    <div className="admin-perf-chart">
      <div className="admin-perf-chart__head">
        <h2>Vendas por categoria</h2>
      </div>
      {!rows.length ? (
        <p className="admin-perf-empty">
          {emptyMessage || 'Ainda não há vendas por categoria neste período.'}
        </p>
      ) : (
        <ul className="admin-perf-bars">
          {rows.map((row) => (
            <li key={row.name}>
              <div className="admin-perf-bars__meta">
                <strong>{row.name}</strong>
                <span>
                  {row.quantity} un. · {formatBRL(row.revenue)} ·{' '}
                  {row.share.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
                </span>
              </div>
              <div className="admin-perf-bars__track" aria-hidden="true">
                <div
                  className="admin-perf-bars__fill"
                  style={{ width: max > 0 ? `${(row.revenue / max) * 100}%` : '0%' }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
