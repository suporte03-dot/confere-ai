/**
 * Pix EMV (BR Code) builder — no external payment API.
 * Generates copia-e-cola payload; QR is rendered separately.
 */

function crc16(payload) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xffff
      else crc = (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function tlv(id, value) {
  const str = String(value ?? '')
  const len = String(str.length).padStart(2, '0')
  return `${id}${len}${str}`
}

function sanitizePixText(value, max = 25) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .toUpperCase()
    .slice(0, max)
}

/**
 * @param {{
 *   key: string,
 *   merchantName: string,
 *   merchantCity: string,
 *   amount?: number|null,
 *   txid?: string,
 *   description?: string,
 * }} options
 */
export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amount = null,
  txid = '***',
  description = '',
}) {
  const pixKey = String(key || '').trim()
  if (!pixKey) return null

  const name = sanitizePixText(merchantName || 'TERRA E ESTILO', 25) || 'TERRA E ESTILO'
  const city = sanitizePixText(merchantCity || 'SAO PAULO', 15) || 'SAO PAULO'
  const tx = String(txid || '***')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 25) || '***'

  let merchantAccount = tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', pixKey)
  if (description) {
    merchantAccount += tlv('02', String(description).slice(0, 50))
  }

  let payload = ''
  payload += tlv('00', '01')
  payload += tlv('26', merchantAccount)
  payload += tlv('52', '0000')
  payload += tlv('53', '986')
  if (amount != null && Number.isFinite(Number(amount)) && Number(amount) > 0) {
    payload += tlv('54', Number(amount).toFixed(2))
  }
  payload += tlv('58', 'BR')
  payload += tlv('59', name)
  payload += tlv('60', city)
  payload += tlv('62', tlv('05', tx))
  payload += '6304'
  payload += crc16(payload)
  return payload
}

export const PIX_KEY_TYPES = [
  { id: 'cpf', label: 'CPF' },
  { id: 'cnpj', label: 'CNPJ' },
  { id: 'email', label: 'E-mail' },
  { id: 'phone', label: 'Telefone' },
  { id: 'random', label: 'Chave aleatória' },
]
