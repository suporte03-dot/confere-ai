'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../../src/lib/supabase/server'
import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { friendlyError } from '../../../../src/lib/admin/format'
import { PIX_KEY_TYPES } from '../../../../src/lib/pix/emv'

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

const VALID_PIX_TYPES = new Set(PIX_KEY_TYPES.map((item) => item.id))

function revalidateSettings() {
  revalidatePath('/admin/configuracoes')
  revalidatePath('/admin')
  revalidatePath('/checkout')
  revalidatePath('/pedido')
}

export async function saveStoreSettingsAction(input) {
  const gate = await assertAdminAccess()
  if (!gate.ok) return gateFail(gate)

  try {
    const pix_key_type = String(input?.pix_key_type || 'random').trim()
    if (!VALID_PIX_TYPES.has(pix_key_type)) {
      return fail('Tipo de chave Pix inválido.')
    }

    const pix_key = String(input?.pix_key || '').trim()
    const pix_receiver_name = String(input?.pix_receiver_name || '').trim()
    const pix_city = String(input?.pix_city || '').trim()
    const pix_instructions = String(input?.pix_instructions || '').trim()
    const payment_link_url = String(input?.payment_link_url || '').trim()
    const whatsapp = String(input?.whatsapp || '').trim()
    const commercial_email = String(input?.commercial_email || '').trim()

    const reservationRaw = Number.parseInt(String(input?.reservation_minutes ?? ''), 10)
    const thresholdRaw = Number.parseInt(String(input?.low_stock_threshold ?? ''), 10)

    if (!Number.isFinite(reservationRaw) || reservationRaw < 5 || reservationRaw > 24 * 60) {
      return fail('Informe o tempo de reserva entre 5 e 1440 minutos.')
    }
    if (!Number.isFinite(thresholdRaw) || thresholdRaw < 0 || thresholdRaw > 9999) {
      return fail('Informe um limiar de estoque baixo válido.')
    }

    if (!pix_receiver_name) return fail('Informe o nome do recebedor Pix.')
    if (!pix_city) return fail('Informe a cidade do recebedor Pix.')

    if (payment_link_url && !/^https?:\/\//i.test(payment_link_url)) {
      return fail('O link de pagamento deve começar com http:// ou https://.')
    }

    if (commercial_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(commercial_email)) {
      return fail('Informe um e-mail comercial válido.')
    }

    const payload = {
      pix_key_type,
      pix_key,
      pix_receiver_name,
      pix_city,
      pix_instructions: pix_instructions || null,
      payment_link_url: payment_link_url || null,
      whatsapp: whatsapp || null,
      commercial_email: commercial_email || null,
      reservation_minutes: reservationRaw,
      low_stock_threshold: thresholdRaw,
      updated_at: new Date().toISOString(),
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('store_settings')
      .update(payload)
      .eq('id', 1)
      .select('id')
      .maybeSingle()

    if (error) {
      return fail(friendlyError(error, 'Não foi possível salvar as configurações.'))
    }
    if (!data) {
      return fail('Configurações da loja não encontradas.')
    }

    revalidateSettings()
    return ok({ message: 'Configurações salvas com sucesso.' })
  } catch (error) {
    return fail(friendlyError(error, 'Não foi possível salvar as configurações.'))
  }
}
