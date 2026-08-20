'use server'

import { revalidatePath } from 'next/cache'
import { placeGuestOrder } from '../../src/lib/orders/service'

function fail(message) {
  return { ok: false, error: message }
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function validateCheckoutInput(input) {
  const name = String(input?.customer?.name || '').trim()
  const email = String(input?.customer?.email || '').trim().toLowerCase()
  const phone = digits(input?.customer?.phone)
  const street = String(input?.address?.street || '').trim()
  const number = String(input?.address?.number || '').trim()
  const district = String(input?.address?.district || '').trim()
  const city = String(input?.address?.city || '').trim()
  const state = String(input?.address?.state || '').trim().toUpperCase()
  const cep = digits(input?.address?.cep)

  if (name.length < 3) return 'Informe o nome completo.'
  if (!email.includes('@') || email.length < 5) return 'Informe um e-mail válido.'
  if (phone.length < 10 || phone.length > 11) return 'Informe um telefone válido com DDD.'
  if (street.length < 2) return 'Informe o endereço.'
  if (!number) return 'Informe o número.'
  if (district.length < 2) return 'Informe o bairro.'
  if (city.length < 2) return 'Informe a cidade.'
  if (!/^[A-Z]{2}$/.test(state)) return 'Informe o estado (UF).'
  if (cep.length !== 8) return 'Informe um CEP válido.'

  const items = Array.isArray(input?.items) ? input.items : []
  if (!items.length) return 'Seu carrinho está vazio.'

  for (const item of items) {
    if (!item?.variantId) return 'Selecione o tamanho de cada produto.'
    const qty = Number.parseInt(String(item.quantity), 10)
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      return 'Quantidade inválida no carrinho.'
    }
  }

  return null
}

/**
 * Browser sends only variantId + quantity.
 * Server/RPC recalculates price and stock.
 */
export async function createCheckoutOrder(input) {
  const validationError = validateCheckoutInput(input)
  if (validationError) return fail(validationError)

  const payload = {
    customer: {
      name: String(input.customer.name).trim(),
      email: String(input.customer.email).trim().toLowerCase(),
      phone: digits(input.customer.phone),
      cpf: digits(input.customer.cpf || '') || null,
    },
    address: {
      street: String(input.address.street).trim(),
      number: String(input.address.number).trim(),
      complement: String(input.address.complement || '').trim(),
      district: String(input.address.district).trim(),
      city: String(input.address.city).trim(),
      state: String(input.address.state).trim().toUpperCase(),
      cep: digits(input.address.cep),
    },
    notes: String(input.notes || '').trim().slice(0, 500),
    items: input.items.map((item) => ({
      variant_id: item.variantId,
      quantity: Number.parseInt(String(item.quantity), 10),
    })),
  }

  // Never trust client prices — omitted from payload intentionally.
  const result = await placeGuestOrder(payload)
  if (!result.ok) return fail(result.error)

  revalidatePath('/admin/pedidos')
  revalidatePath('/admin')
  revalidatePath('/admin/estoque')

  return {
    ok: true,
    orderNumber: result.orderNumber,
    publicToken: result.publicToken,
    total: result.total,
    reservedUntil: result.reservedUntil,
  }
}
