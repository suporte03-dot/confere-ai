import { createClient } from '../supabase/server'
import { createPublicClient } from '../supabase/public'

const SETTINGS_SELECT = `
  id,
  pix_key_type,
  pix_key,
  pix_receiver_name,
  pix_city,
  pix_instructions,
  payment_link_url,
  whatsapp,
  commercial_email,
  reservation_minutes,
  low_stock_threshold,
  updated_at
`

export function emptyStoreSettings() {
  return {
    id: 1,
    pix_key_type: 'random',
    pix_key: '',
    pix_receiver_name: 'Terra e Estilo',
    pix_city: 'Sao Paulo',
    pix_instructions:
      'Após o pagamento, aguarde a confirmação manual da loja. Você receberá atualizações pelo contato informado.',
    payment_link_url: '',
    whatsapp: '',
    commercial_email: '',
    reservation_minutes: 60,
    low_stock_threshold: 5,
    updated_at: null,
  }
}

export async function fetchStoreSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('store_settings')
      .select(SETTINGS_SELECT)
      .eq('id', 1)
      .maybeSingle()

    if (error) throw error
    return data ? { ...emptyStoreSettings(), ...data } : emptyStoreSettings()
  } catch {
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('store_settings')
        .select(SETTINGS_SELECT)
        .eq('id', 1)
        .maybeSingle()
      return data ? { ...emptyStoreSettings(), ...data } : emptyStoreSettings()
    } catch {
      return emptyStoreSettings()
    }
  }
}

/** Public payment display — never includes admin-only secrets beyond Pix key (needed to pay). */
export function toPublicPaymentSettings(settings) {
  const s = settings || emptyStoreSettings()
  return {
    pixKeyType: s.pix_key_type || '',
    pixKey: s.pix_key || '',
    pixReceiverName: s.pix_receiver_name || 'Terra e Estilo',
    pixCity: s.pix_city || 'Sao Paulo',
    pixInstructions: s.pix_instructions || '',
    paymentLinkUrl: s.payment_link_url || '',
    whatsapp: s.whatsapp || '',
    commercialEmail: s.commercial_email || '',
    reservationMinutes: Number(s.reservation_minutes) || 60,
  }
}
