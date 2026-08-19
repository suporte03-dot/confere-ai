import { getSupabaseProjectUrl } from '../supabase/env'

export function formatBRL(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function parseMoneyInput(value) {
  if (value === '' || value == null) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const normalized = String(value)
    .trim()
    .replace(/\s/g, '')
    .replace(/R\$/gi, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

export function productImagePublicUrl(storagePath) {
  if (!storagePath) return null
  if (/^https?:\/\//i.test(storagePath)) return storagePath
  try {
    const url = getSupabaseProjectUrl()
    return `${url}/storage/v1/object/public/product-images/${storagePath}`
  } catch {
    return null
  }
}

export function friendlyError(error, fallback = 'Não foi possível concluir a operação. Tente novamente.') {
  if (!error) return fallback
  const message = typeof error === 'string' ? error : error.message || ''
  const code = error.code || ''

  if (code === '23505' || /duplicate|unique/i.test(message)) {
    return 'Já existe um registro com esses dados. Verifique o slug ou o SKU.'
  }
  if (code === '42501' || /permission|rls|policy/i.test(message)) {
    return 'Você não tem permissão para esta ação. Faça login novamente.'
  }
  if (/JWT|session|auth/i.test(message)) {
    return 'Sua sessão expirou. Entre novamente para continuar.'
  }
  if (/payload too large|entity too large|file size/i.test(message)) {
    return 'Arquivo muito grande. Escolha uma imagem menor.'
  }
  if (/mime|image|not allowed|invalid file/i.test(message)) {
    return 'Envie apenas arquivos de imagem válidos.'
  }

  return fallback
}
