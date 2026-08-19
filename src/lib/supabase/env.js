/**
 * Explicit Supabase env reads.
 * Browser uses NEXT_PUBLIC_*; server/proxy prefer SUPABASE_* with NEXT_PUBLIC_* fallback.
 */

export function getBrowserSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  }

  return { url, key }
}

export function getServerSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url) {
    throw new Error('Missing SUPABASE_URL')
  }
  if (!key) {
    throw new Error('Missing SUPABASE_PUBLISHABLE_KEY')
  }

  return { url, key }
}
