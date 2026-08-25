/** Period presets and date-range helpers for the performance dashboard. */

export const PERIOD_PRESETS = [
  { key: 'today', label: 'Hoje' },
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: 'month', label: 'Este mês' },
  { key: 'prev_month', label: 'Mês anterior' },
  { key: 'custom', label: 'Personalizado' },
]

export const DEFAULT_PERIOD = '30d'

const PRESET_KEYS = new Set(PERIOD_PRESETS.map((item) => item.key))

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function parseDateInput(value) {
  if (!value) return null
  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  if (Number.isNaN(d.getTime())) return null
  return d
}

export function normalizePeriodKey(value) {
  const key = String(value || '').trim()
  return PRESET_KEYS.has(key) ? key : DEFAULT_PERIOD
}

export function periodLabel(key, range) {
  const preset = PERIOD_PRESETS.find((item) => item.key === key)
  if (key === 'custom' && range?.start && range?.end) {
    const fmt = (d) =>
      d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    return `${fmt(range.start)} — ${fmt(range.end)}`
  }
  if (key === '30d') return 'Últimos 30 dias'
  if (key === '7d') return 'Últimos 7 dias'
  return preset?.label || 'Últimos 30 dias'
}

/**
 * Resolve an inclusive calendar range for the selected preset.
 * @returns {{ start: Date, end: Date, key: string }}
 */
export function resolvePeriodRange({
  periodKey = DEFAULT_PERIOD,
  from = null,
  to = null,
  now = new Date(),
} = {}) {
  const key = normalizePeriodKey(periodKey)
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  if (key === 'today') {
    return { key, start: todayStart, end: todayEnd }
  }

  if (key === '7d') {
    const start = startOfDay(now)
    start.setDate(start.getDate() - 6)
    return { key, start, end: todayEnd }
  }

  if (key === '30d') {
    const start = startOfDay(now)
    start.setDate(start.getDate() - 29)
    return { key, start, end: todayEnd }
  }

  if (key === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return { key, start: startOfDay(start), end: todayEnd }
  }

  if (key === 'prev_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    return { key, start: startOfDay(start), end: endOfDay(end) }
  }

  // custom
  let start = parseDateInput(from)
  let end = parseDateInput(to)
  if (!start && !end) {
    const fallback = resolvePeriodRange({ periodKey: DEFAULT_PERIOD, now })
    return { ...fallback, key: 'custom' }
  }
  if (!start) start = end
  if (!end) end = start
  if (start > end) {
    const tmp = start
    start = end
    end = tmp
  }
  return { key: 'custom', start: startOfDay(start), end: endOfDay(end) }
}

/** Same-length window immediately before `range.start`. */
export function previousPeriodRange(range) {
  if (!range?.start || !range?.end) return null
  const durationMs = range.end.getTime() - range.start.getTime()
  if (!Number.isFinite(durationMs) || durationMs < 0) return null
  const end = new Date(range.start.getTime() - 1)
  const start = new Date(end.getTime() - durationMs)
  return { start, end }
}

export function isDateInRange(value, range) {
  if (!range?.start || !range?.end || !value) return false
  const t = new Date(value).getTime()
  if (Number.isNaN(t)) return false
  return t >= range.start.getTime() && t <= range.end.getTime()
}

export function toDateInputValue(date) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dayKey(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
