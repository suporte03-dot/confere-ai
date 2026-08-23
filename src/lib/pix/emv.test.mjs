import assert from 'node:assert/strict'
import { buildPixPayload } from './emv.js'

const payload = buildPixPayload({
  key: 'terraeestilo@example.com',
  merchantName: 'Terra e Estilo',
  merchantCity: 'Sao Paulo',
  amount: 199.9,
  txid: 'TE202608200001',
})

assert.ok(payload)
assert.ok(payload.startsWith('000201'))
assert.ok(payload.includes('BR.GOV.BCB.PIX'))
assert.ok(payload.includes('199.90'))
assert.match(payload, /6304[0-9A-F]{4}$/)

const empty = buildPixPayload({ key: '', merchantName: 'X', merchantCity: 'Y' })
assert.equal(empty, null)

console.log('pix emv ok')
