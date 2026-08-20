import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isAuditTestRecord } from './test-records.js'

test('aceita registros de auditoria pelo prefixo do nome', () => {
  assert.equal(isAuditTestRecord({ name: '[TESTE AUDIT] Categoria x' }), true)
  assert.equal(isAuditTestRecord({ name: '[TESTE] Produto' }), true)
})

test('aceita registros de auditoria pelo slug', () => {
  assert.equal(isAuditTestRecord({ slug: 'teste-audit-produto-1' }), true)
})

test('rejeita registros reais', () => {
  assert.equal(isAuditTestRecord({ name: 'Camisa Country', slug: 'camisa-country' }), false)
  assert.equal(isAuditTestRecord({ name: 'Teste', slug: 'teste' }), false)
})
