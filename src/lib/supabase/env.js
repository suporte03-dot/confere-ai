/**
 * Explicit Supabase env reads.
 * Browser uses NEXT_PUBLIC_*; server also accepts SUPABASE_* fallbacks.
 * Placeholder values must never win over a later valid key.
 *
 * NEXT_PUBLIC_* are referenced as static process.env.NEXT_PUBLIC_* literals
 * so Next.js can inline them correctly at build time.
 */

function normalizeEnvValue(value) {
  if (value == null) return ''
  let text = String(value).trim()
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim()
  }
  return text
}

function firstUsable(isUsable, ...values) {
  for (const value of values) {
    const normalized = normalizeEnvValue(value)
    if (isUsable(normalized)) return normalized
  }
  return ''
}

export function isUsableSupabaseUrl(url) {
  const value = normalizeEnvValue(url)
  if (!value) return false
  if (/sua url|your[- ]?url|placeholder|changeme|example|\.\.\./i.test(value)) {
    return false
  }
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(value)
}

export function isUsableSupabaseKey(key) {
  const value = normalizeEnvValue(key)
  if (!value) return false
  if (
    /sua chave|your[- ]?key|placeholder|changeme|example|\.\.\./i.test(value) ||
    value === 'sb_publishable_...' ||
    /^sb_publishable_\.+$/i.test(value)
  ) {
    return false
  }
  // Legacy anon JWT — preferred when present and valid length
  if (value.startsWith('eyJ')) {
    return value.length >= 100
  }
  // New publishable keys (require substantial length beyond the prefix)
  if (value.startsWith('sb_publishable_')) {
    return value.length >= 50
  }
  return false
}

function describeKeySlot(raw) {
  const value = normalizeEnvValue(raw)
  const exists = Boolean(value)
  let prefix = ''
  if (value.startsWith('eyJ')) prefix = 'eyJ'
  else if (value.startsWith('sb_publishable_')) prefix = 'sb_publishable_'
  else if (value) prefix = value.slice(0, 3)
  return {
    exists,
    length: value.length,
    prefix,
    placeholder: exists ? !isUsableSupabaseKey(value) : false,
    usable: isUsableSupabaseKey(value),
  }
}

function describeUrlSlot(raw) {
  const value = normalizeEnvValue(raw)
  const exists = Boolean(value)
  return {
    exists,
    length: value.length,
    prefix: value ? value.slice(0, 8) : '',
    placeholder: exists ? !isUsableSupabaseUrl(value) : false,
    usable: isUsableSupabaseUrl(value),
  }
}

/**
 * Pick the best key: prefer usable JWT anon, then publishable forms.
 * All candidates are passed through isUsable (placeholders skipped).
 */
function resolveSupabaseKey({ anon, publishable, serverPublishable }) {
  const anonKey = normalizeEnvValue(anon)
  const pubKey = normalizeEnvValue(publishable)
  const serverKey = normalizeEnvValue(serverPublishable)

  // Prefer legacy JWT when it is genuinely usable.
  if (anonKey.startsWith('eyJ') && isUsableSupabaseKey(anonKey)) {
    return anonKey
  }

  return firstUsable(
    isUsableSupabaseKey,
    pubKey,
    anonKey,
    serverKey,
  )
}

/**
 * Safe diagnostics for Preview/Vercel — never includes secret values.
 */
export function getSupabaseEnvHealth() {
  const nextPublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.SUPABASE_URL
  const nextPublicPublishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const nextPublicAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabasePublishable = process.env.SUPABASE_PUBLISHABLE_KEY

  const resolvedUrl = firstUsable(
    isUsableSupabaseUrl,
    supabaseUrl,
    nextPublicUrl,
  )
  const resolvedKey = resolveSupabaseKey({
    anon: nextPublicAnon,
    publishable: nextPublicPublishable,
    serverPublishable: supabasePublishable,
  })

  return {
    NEXT_PUBLIC_SUPABASE_URL: describeUrlSlot(nextPublicUrl),
    SUPABASE_URL: describeUrlSlot(supabaseUrl),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: describeKeySlot(nextPublicPublishable),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: describeKeySlot(nextPublicAnon),
    SUPABASE_PUBLISHABLE_KEY: describeKeySlot(supabasePublishable),
    resolvedUrl: Boolean(resolvedUrl),
    resolvedKey: Boolean(resolvedKey),
  }
}

function readRuntimeBrowserEnv() {
  if (typeof window === 'undefined') {
    return { url: '', key: '' }
  }
  return {
    url: window.__TE_SUPABASE_URL__ || '',
    key: window.__TE_SUPABASE_KEY__ || '',
  }
}

export function getBrowserSupabaseEnv() {
  const runtime = readRuntimeBrowserEnv()
  const url = firstUsable(
    isUsableSupabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    runtime.url,
  )
  const key =
    resolveSupabaseKey({
      anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      publishable: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      serverPublishable: '',
    }) || firstUsable(isUsableSupabaseKey, runtime.key)

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  }

  return { url, key }
}

export function readServerSupabaseEnv() {
  return {
    url: firstUsable(
      isUsableSupabaseUrl,
      process.env.SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    key: resolveSupabaseKey({
      anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      publishable: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      serverPublishable: process.env.SUPABASE_PUBLISHABLE_KEY,
    }),
  }
}

export function getServerSupabaseEnv() {
  const { url, key } = readServerSupabaseEnv()

  if (!url) {
    throw new Error('Missing SUPABASE_URL')
  }
  if (!key) {
    throw new Error('Missing SUPABASE_PUBLISHABLE_KEY')
  }

  return { url, key }
}

export function getSupabaseProjectUrl() {
  const url = firstUsable(
    isUsableSupabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
  )
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  return url
}
