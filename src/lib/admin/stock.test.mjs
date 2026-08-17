import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyStock, buildStockAlertState, STOCK_STATUS } from './stock.js'

test('estoque 10 → normal, sem alerta', () => {
  assert.equal(classifyStock(10), STOCK_STATUS.NORMAL)
  const state = buildStockAlertState([{ id: 'a', stock: 10, product: { name: 'Peça' } }])
  assert.equal(state.summary.total, 0)
})

test('estoque 5 → baixo', () => {
  assert.equal(classifyStock(5), STOCK_STATUS.LOW)
})

test('estoque 4 → baixo', () => {
  assert.equal(classifyStock(4), STOCK_STATUS.LOW)
})

test('estoque 3 → crítico', () => {
  assert.equal(classifyStock(3), STOCK_STATUS.CRITICAL)
})

test('estoque 1 → crítico', () => {
  assert.equal(classifyStock(1), STOCK_STATUS.CRITICAL)
})

test('estoque 0 → esgotado', () => {
  assert.equal(classifyStock(0), STOCK_STATUS.OUT)
})

test('alerta some quando estoque volta a 10', () => {
  const before = buildStockAlertState([{ id: 'm', stock: 0, product: { name: 'Camisa' } }])
  assert.equal(before.summary.out, 1)
  const after = buildStockAlertState([{ id: 'm', stock: 10, product: { name: 'Camisa' } }])
  assert.equal(after.summary.total, 0)
})

test('M esgotado e G disponível → somente M', () => {
  const state = buildStockAlertState([
    { id: 'm', size: 'M', stock: 0, product_id: 'p1', product: { name: 'Camisa' } },
    { id: 'g', size: 'G', stock: 12, product_id: 'p1', product: { name: 'Camisa' } },
  ])
  assert.equal(state.summary.total, 1)
  assert.equal(state.alerts[0].id, 'm')
  assert.equal(state.alerts[0].size, 'M')
})

test('variante inativa não entra no alerta', () => {
  const state = buildStockAlertState([
    { id: 'x', stock: 0, active: false, product: { name: 'Peça' } },
  ])
  assert.equal(state.summary.total, 0)
})
