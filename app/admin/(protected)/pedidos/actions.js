'use server'

import { revalidatePath } from 'next/cache'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { friendlyError } from '../../../../src/lib/admin/format'
import {
  confirmOrderPayment,
  transitionOrderStatus,
} from '../../../../src/lib/orders/service'

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

export async function confirmPaymentAction(orderId) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    if (!orderId) return fail('Pedido não encontrado.')
    const result = await confirmOrderPayment(orderId)
    if (!result.ok) {
      return fail(result.error || 'Não foi possível confirmar o pagamento.')
    }
    revalidateOrders(orderId)
    return ok({ message: 'Pagamento confirmado com sucesso.' })
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
    revalidateOrders(orderId)
    return ok({ message: 'Status do pedido atualizado.' })
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
    revalidateOrders(orderId)
    return ok({ message: 'Pedido cancelado.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível cancelar o pedido.'))
  }
}
