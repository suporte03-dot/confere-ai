import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from './env'

/**
 * Anon/publishable client for public storefront reads.
 * No cookies / session — suitable for Server Components catalog queries.
 */
export function createPublicClient() {
  const { url, key } = getSupabaseEnv()
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
