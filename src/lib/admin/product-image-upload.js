export const IMAGE_BUCKET = 'product-images'
export const AI_IMAGE_BUCKET = 'ai-intake'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

const TYPE_EXTENSION = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function formatImageBytes(bytes) {
  const size = Number(bytes) || 0
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(size < 10 * 1024 ? 1 : 0).replace('.', ',')} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export function validateImageFile(file) {
  if (!file || typeof file !== 'object' || !file.size) {
    return 'Selecione uma imagem para enviar.'
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Envie apenas arquivos de imagem (JPG, PNG ou WEBP).'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'A imagem deve ter no máximo 5 MB.'
  }
  return null
}

export function extensionFromFile(file) {
  const mapped = TYPE_EXTENSION[file?.type]
  if (mapped) return mapped
  const fromName = String(file?.name || '')
    .split('.')
    .pop()
    ?.toLowerCase()
  if (fromName === 'jpeg') return 'jpg'
  if (fromName && ['jpg', 'png', 'webp'].includes(fromName)) return fromName
  return 'jpg'
}

function slugifyStem(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function sanitizeFileStem(fileName) {
  const stem = String(fileName || '')
    .replace(/\.[^.]+$/, '')
    .trim()
  return slugifyStem(stem).slice(0, 48) || 'imagem'
}

function uniqueNamePart() {
  const rand =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${Date.now()}-${rand}`
}

export function buildProductImagePath(productId, file) {
  const ext = extensionFromFile(file)
  const stem = sanitizeFileStem(file?.name)
  return `products/${productId}/${uniqueNamePart()}-${stem}.${ext}`
}

export function buildAiIntakePath(userId, file) {
  const ext = extensionFromFile(file)
  const stem = sanitizeFileStem(file?.name)
  return `ai-intake/${userId}/${uniqueNamePart()}-${stem}.${ext}`
}

function isSafeObjectName(name) {
  return Boolean(name) && !name.includes('/') && !name.includes('\\') && !name.includes('..')
}

export function isSafeProductImagePath(productId, storagePath) {
  const id = String(productId || '')
  const path = String(storagePath || '').replace(/\\/g, '/')
  if (!id || !path || path.includes('..') || path.startsWith('/') || path.includes('//')) {
    return false
  }
  const prefix = `products/${id}/`
  if (!path.startsWith(prefix)) return false
  return isSafeObjectName(path.slice(prefix.length)) && path.length <= 240
}

export function isSafeAiIntakePath(userId, storagePath) {
  const id = String(userId || '')
  const path = String(storagePath || '').replace(/\\/g, '/')
  if (!id || !path || path.includes('..') || path.startsWith('/') || path.includes('//')) {
    return false
  }
  const prefix = `ai-intake/${id}/`
  if (!path.startsWith(prefix)) return false
  return isSafeObjectName(path.slice(prefix.length)) && path.length <= 240
}

export async function uploadImageToBucket(
  supabase,
  file,
  storagePath,
  bucket = IMAGE_BUCKET,
) {
  const contentType = file.type === 'image/jpg' ? 'image/jpeg' : file.type
  const { data, error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType,
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return data?.path || storagePath
}

export async function removeStorageObject(supabase, storagePath, bucket = IMAGE_BUCKET) {
  if (!storagePath) return
  await supabase.storage.from(bucket).remove([storagePath])
}
