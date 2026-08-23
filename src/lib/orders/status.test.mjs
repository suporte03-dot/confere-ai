import assert from 'node:assert/strict'
import {
  canCancelOrder,
  canConfirmPayment,
  nextOrderStatuses,
  orderStatusLabel,
} from './status.js'

assert.equal(orderStatusLabel('pending_payment'), 'Aguardando pagamento')
assert.equal(canConfirmPayment({ order_status: 'pending_payment', payment_status: 'pending' }), true)
assert.equal(canConfirmPayment({ order_status: 'paid', payment_status: 'paid' }), false)
assert.deepEqual(nextOrderStatuses('paid'), ['processing'])
assert.deepEqual(nextOrderStatuses('processing'), ['shipped'])
assert.equal(canCancelOrder({ order_status: 'delivered' }), false)
assert.equal(canCancelOrder({ order_status: 'pending_payment' }), true)

console.log('orders status ok')
