/** Order / payment status labels for ADM and storefront. */

export const ORDER_STATUS = {
  pending_payment: 'Aguardando pagamento',
  paid: 'Pago',
  processing: 'Em preparação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  expired: 'Expirado',
}

export const PAYMENT_STATUS = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado',
  expired: 'Expirado',
  refunded: 'Estornado',
}

export function orderStatusLabel(status) {
  return ORDER_STATUS[status] || status || '—'
}

export function paymentStatusLabel(status) {
  return PAYMENT_STATUS[status] || status || '—'
}

/** Allowed next order statuses from current (excluding cancel). */
export function nextOrderStatuses(current) {
  switch (current) {
    case 'paid':
      return ['processing']
    case 'processing':
      return ['shipped']
    case 'shipped':
      return ['delivered']
    default:
      return []
  }
}

export function canConfirmPayment(order) {
  return (
    order?.order_status === 'pending_payment' &&
    order?.payment_status === 'pending'
  )
}

export function canCancelOrder(order) {
  return !['delivered', 'cancelled', 'expired'].includes(order?.order_status)
}
