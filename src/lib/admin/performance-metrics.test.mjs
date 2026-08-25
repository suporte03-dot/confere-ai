import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  aggregateTopProducts,
  buildDailySeries,
  computeItemsSold,
  computeOrderKpis,
  isConfirmedSale,
  percentChange,
} from './performance-metrics.js'
import { resolvePeriodRange } from './performance-period.js'

const range = resolvePeriodRange({
  periodKey: 'custom',
  from: '2026-08-01',
  to: '2026-08-31',
  now: new Date(2026, 7, 24),
})

describe('performance-metrics', () => {
  it('só confirma venda com pagamento pago e não cancelado', () => {
    assert.equal(
      isConfirmedSale({ payment_status: 'paid', order_status: 'paid' }),
      true,
    )
    assert.equal(
      isConfirmedSale({ payment_status: 'pending', order_status: 'pending_payment' }),
      false,
    )
    assert.equal(
      isConfirmedSale({ payment_status: 'paid', order_status: 'cancelled' }),
      false,
    )
    assert.equal(
      isConfirmedSale({ payment_status: 'paid', order_status: 'expired' }),
      false,
    )
  })

  it('faturamento ignora pending, cancelled e expired', () => {
    const orders = [
      {
        id: '1',
        total: 100,
        payment_status: 'paid',
        order_status: 'paid',
        paid_at: '2026-08-10T12:00:00.000Z',
        created_at: '2026-08-10T10:00:00.000Z',
      },
      {
        id: '2',
        total: 200,
        payment_status: 'pending',
        order_status: 'pending_payment',
        created_at: '2026-08-11T10:00:00.000Z',
      },
      {
        id: '3',
        total: 300,
        payment_status: 'paid',
        order_status: 'cancelled',
        paid_at: '2026-08-12T12:00:00.000Z',
        created_at: '2026-08-12T10:00:00.000Z',
      },
      {
        id: '4',
        total: 50,
        payment_status: 'expired',
        order_status: 'expired',
        created_at: '2026-08-13T10:00:00.000Z',
      },
    ]
    const kpis = computeOrderKpis(orders, range)
    assert.equal(kpis.revenue, 100)
    assert.equal(kpis.paidCount, 1)
    assert.equal(kpis.orderCount, 4)
    assert.equal(kpis.ticketAverage, 100)
    assert.equal(kpis.byStatus.pending_payment, 1)
    assert.equal(kpis.byStatus.cancelled, 1)
  })

  it('ticket médio = faturamento / pedidos pagos', () => {
    const orders = [
      {
        id: 'a',
        total: 100,
        payment_status: 'paid',
        order_status: 'processing',
        paid_at: '2026-08-05T12:00:00.000Z',
        created_at: '2026-08-05T10:00:00.000Z',
      },
      {
        id: 'b',
        total: 200,
        payment_status: 'paid',
        order_status: 'shipped',
        paid_at: '2026-08-06T12:00:00.000Z',
        created_at: '2026-08-06T10:00:00.000Z',
      },
    ]
    const kpis = computeOrderKpis(orders, range)
    assert.equal(kpis.revenue, 300)
    assert.equal(kpis.ticketAverage, 150)
  })

  it('itens vendidos só de pedidos pagos', () => {
    const paidIds = new Set(['paid-1'])
    const items = [
      { order_id: 'paid-1', quantity: 2 },
      { order_id: 'paid-1', quantity: 3 },
      { order_id: 'pending-1', quantity: 9 },
    ]
    assert.equal(computeItemsSold(items, paidIds), 5)
  })

  it('produtos mais vendidos agrega quantidade e faturamento', () => {
    const paidIds = new Set(['o1', 'o2'])
    const items = [
      {
        order_id: 'o1',
        product_id: 'p1',
        product_name: 'Camisa',
        variant_label: 'M',
        quantity: 2,
        line_total: 200,
      },
      {
        order_id: 'o2',
        product_id: 'p1',
        product_name: 'Camisa',
        variant_label: 'M',
        quantity: 1,
        line_total: 100,
      },
      {
        order_id: 'o2',
        product_id: 'p2',
        product_name: 'Bota',
        variant_label: '38',
        quantity: 5,
        line_total: 500,
      },
      {
        order_id: 'pending',
        product_id: 'p2',
        product_name: 'Bota',
        quantity: 99,
        line_total: 999,
      },
    ]
    const top = aggregateTopProducts(items, paidIds, { limit: 5 })
    assert.equal(top[0].productName, 'Bota')
    assert.equal(top[0].quantity, 5)
    assert.equal(top[1].quantity, 3)
    assert.equal(top[1].revenue, 300)
  })

  it('comparação evita divisão por zero', () => {
    const empty = percentChange(0, 0)
    assert.equal(empty.pct, null)
    assert.match(empty.label, /Sem período anterior/)

    const growth = percentChange(110, 100)
    assert.equal(growth.pct, 10)
    assert.equal(growth.direction, 'up')

    const fromZero = percentChange(50, 0)
    assert.equal(fromZero.pct, null)
  })

  it('série diária só conta vendas confirmadas', () => {
    const orders = [
      {
        id: '1',
        total: 80,
        payment_status: 'paid',
        order_status: 'paid',
        paid_at: '2026-08-10T15:00:00.000Z',
        created_at: '2026-08-10T10:00:00.000Z',
      },
      {
        id: '2',
        total: 40,
        payment_status: 'pending',
        order_status: 'pending_payment',
        created_at: '2026-08-10T11:00:00.000Z',
      },
    ]
    const dayRange = resolvePeriodRange({
      periodKey: 'custom',
      from: '2026-08-10',
      to: '2026-08-10',
      now: new Date(2026, 7, 24),
    })
    const series = buildDailySeries(orders, dayRange, { mode: 'revenue' })
    assert.equal(series.length, 1)
    assert.equal(series[0].revenue, 80)
    assert.equal(series[0].orders, 1)
  })
})
