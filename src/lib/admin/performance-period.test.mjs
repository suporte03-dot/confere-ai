import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  DEFAULT_PERIOD,
  normalizePeriodKey,
  previousPeriodRange,
  resolvePeriodRange,
  toDateInputValue,
} from './performance-period.js'

describe('performance-period', () => {
  it('usa 30 dias como padrão', () => {
    assert.equal(normalizePeriodKey(''), DEFAULT_PERIOD)
    assert.equal(normalizePeriodKey('invalid'), DEFAULT_PERIOD)
  })

  it('resolve últimos 30 dias inclusivos', () => {
    const now = new Date(2026, 7, 24, 15, 0, 0)
    const range = resolvePeriodRange({ periodKey: '30d', now })
    assert.equal(toDateInputValue(range.start), '2026-07-26')
    assert.equal(toDateInputValue(range.end), '2026-08-24')
  })

  it('resolve hoje', () => {
    const now = new Date(2026, 7, 24, 18, 30, 0)
    const range = resolvePeriodRange({ periodKey: 'today', now })
    assert.equal(toDateInputValue(range.start), '2026-08-24')
    assert.equal(toDateInputValue(range.end), '2026-08-24')
  })

  it('resolve mês anterior', () => {
    const now = new Date(2026, 7, 24)
    const range = resolvePeriodRange({ periodKey: 'prev_month', now })
    assert.equal(toDateInputValue(range.start), '2026-07-01')
    assert.equal(toDateInputValue(range.end), '2026-07-31')
  })

  it('calcula período anterior com mesma duração', () => {
    const now = new Date(2026, 7, 24, 12, 0, 0)
    const range = resolvePeriodRange({ periodKey: '30d', now })
    const prev = previousPeriodRange(range)
    assert.ok(prev)
    const duration = range.end.getTime() - range.start.getTime()
    const prevDuration = prev.end.getTime() - prev.start.getTime()
    assert.equal(prevDuration, duration)
    assert.ok(prev.end.getTime() < range.start.getTime())
  })

  it('aceita intervalo personalizado e corrige ordem invertida', () => {
    const range = resolvePeriodRange({
      periodKey: 'custom',
      from: '2026-08-20',
      to: '2026-08-10',
      now: new Date(2026, 7, 24),
    })
    assert.equal(toDateInputValue(range.start), '2026-08-10')
    assert.equal(toDateInputValue(range.end), '2026-08-20')
  })
})
