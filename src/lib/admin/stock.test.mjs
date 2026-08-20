import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  classifyStock,
  buildStockAlertState,
  filterStockAlerts,
  formatVariantLabel,
  summarizeVariantStock,
  STOCK_STATUS,
} from './stock.js'

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

test('listagem usa o pior estoque da variante, não o total', () => {
  const summary = summarizeVariantStock([{ stock: 0 }, { stock: 20 }])
  assert.equal(summary.totalStock, 20)
  assert.equal(summary.worstStock, 0)
  assert.equal(summary.hasAlertVariant, true)
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

test('busca por nome, tamanho, cor e SKU', () => {
  const alerts = [
    {
      id: '1',
      status: STOCK_STATUS.CRITICAL,
      productName: 'Camisa Country Premium',
      color: 'Preto',
      size: 'M',
      sku: 'CAM-M-PT',
    },
    {
      id: '2',
      status: STOCK_STATUS.OUT,
      productName: 'Bota Texas',
      color: 'Marrom',
      size: '38',
      sku: 'BOT-38',
    },
  ]
  assert.equal(filterStockAlerts(alerts, { query: 'country' }).length, 1)
  assert.equal(filterStockAlerts(alerts, { query: '38' })[0].id, '2')
  assert.equal(filterStockAlerts(alerts, { query: 'marrom' })[0].id, '2')
  assert.equal(filterStockAlerts(alerts, { query: 'cam-m' })[0].id, '1')
})

test('filtros esgotados, críticos e baixo', () => {
  const alerts = [
    { id: 'out', status: STOCK_STATUS.OUT, productName: 'A' },
    { id: 'crit', status: STOCK_STATUS.CRITICAL, productName: 'B' },
    { id: 'low', status: STOCK_STATUS.LOW, productName: 'C' },
  ]
  assert.equal(filterStockAlerts(alerts, { filter: 'out' })[0].id, 'out')
  assert.equal(filterStockAlerts(alerts, { filter: 'critical' })[0].id, 'crit')
  assert.equal(filterStockAlerts(alerts, { filter: 'low' })[0].id, 'low')
  assert.equal(filterStockAlerts(alerts, { filter: 'all' }).length, 3)
})

test('rótulo da variação usa ponto médio', () => {
  assert.equal(formatVariantLabel({ color: 'Preto', size: 'M' }), 'Preto • M')
})
