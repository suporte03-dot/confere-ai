/**
 * Explicit Supabase env reads.
 * Browser uses NEXT_PUBLIC_*; server/proxy prefer SUPABASE_* with NEXT_PUBLIC_* fallback.
 * Placeholder values (e.g. "sua chave real") must not win over a real key later in the chain.
 */

function firstUsable(isUsable, ...values) {
  return values.find((value) => isUsable(value)) || ''
}

function isUsableSupabaseUrl(url) {
  if (!url || typeof url !== 'string') {
    return false
  }
  const value = url.trim()
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(value)
}

function isUsableSupabaseKey(key) {
  if (!key || typeof key !== 'string') {
    return false
  }
  const value = key.trim()
  if (
    /sua chave|your[- ]?key|placeholder|changeme|example|\.\.\./i.test(value) ||
    value === 'sb_publishable_...'
  ) {
    return false
  }
  if (value.startsWith('eyJ')) {
    return value.length >= 100
  }
  if (value.startsWith('sb_publishable_')) {
    return value.length >= 40
  }
  return false
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
  const key = firstUsable(
    isUsableSupabaseKey,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    runtime.key,
  )

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
    key: firstUsable(
      isUsableSupabaseKey,
      process.env.SUPABASE_PUBLISHABLE_KEY,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
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
