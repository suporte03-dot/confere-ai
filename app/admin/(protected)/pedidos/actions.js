'use server'

import { revalidatePath } from 'next/cache'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { friendlyError } from '../../../../src/lib/admin/format'
import {
  confirmOrderPayment,
  transitionOrderStatus,
} from '../../../../src/lib/orders/service'
import { dispatchOrderEmailEvent } from '../../../../src/lib/email/service'

function fail(message) {
  return { ok: false, error: message }
}

function ok(data = {}) {
  return { ok: true, ...data }
}

function gateFail(gate) {
  return fail(
    gate.reason === 'unauthenticated'
      ? 'Faça login para continuar.'
      : 'Acesso negado. Seu perfil não tem permissão de administrador.',
  )
}

function revalidateOrders(orderId) {
  revalidatePath('/admin/pedidos')
  revalidatePath('/admin')
  revalidatePath('/admin/estoque')
  if (orderId) revalidatePath(`/admin/pedidos/${orderId}`)
}

async function emailNotice(orderId, eventType) {
  const result = await dispatchOrderEmailEvent({ orderId, eventType })
  return result.ok
    ? ''
    : ' O pedido foi atualizado, mas o e-mail ficou pendente para reenvio.'
}

export async function confirmPaymentAction(orderId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    if (!orderId) return fail('Pedido não encontrado.')
    const result = await confirmOrderPayment(orderId)
    if (!result.ok) {
      return fail(result.error || 'Não foi possível confirmar o pagamento.')
    }
    const emailMessage = await emailNotice(orderId, 'payment_confirmed')
    revalidateOrders(orderId)
    return ok({ message: `Pagamento confirmado com sucesso.${emailMessage}` })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível confirmar o pagamento.'))
  }
}

export async function transitionStatusAction(orderId, next) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    if (!orderId) return fail('Pedido não encontrado.')
    if (!next) return fail('Informe o próximo status.')
    const result = await transitionOrderStatus(orderId, next)
    if (!result.ok) {
      return fail(result.error || 'Não foi possível atualizar o status.')
    }
    const emailType = next === 'shipped' ? 'shipped' : next === 'delivered' ? 'delivered' : null
    const emailMessage = emailType ? await emailNotice(orderId, emailType) : ''
    revalidateOrders(orderId)
    return ok({ message: `Status do pedido atualizado.${emailMessage}` })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível atualizar o status.'))
  }
}

export async function cancelOrderAction(orderId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    if (!orderId) return fail('Pedido não encontrado.')
    const result = await transitionOrderStatus(orderId, 'cancelled')
    if (!result.ok) {
      return fail(result.error || 'Não foi possível cancelar o pedido.')
    }
    const emailMessage = await emailNotice(orderId, 'cancelled')
    revalidateOrders(orderId)
    return ok({ message: `Pedido cancelado.${emailMessage}` })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível cancelar o pedido.'))
  }
}

export async function resendOrderEmailAction(orderId, eventType) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  const allowed = new Set([
    'order_created',
    'payment_confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ])
  if (!orderId || !allowed.has(eventType)) {
    return fail('Evento de e-mail inválido.')
  }

  try {
    const result = await dispatchOrderEmailEvent({
      orderId,
      eventType,
      force: true,
    })
    if (!result.ok) {
      return fail(result.error || 'Não foi possível reenviar o e-mail.')
    }
    revalidateOrders(orderId)
    return ok({ message: 'E-mail reenviado com sucesso.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível reenviar o e-mail.'))
  }
}
