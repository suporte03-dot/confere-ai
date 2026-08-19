import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getServerSupabaseEnv } from './env'

/**
 * Anon/publishable client for public storefront reads.
 * No cookies / session — suitable for Server Components catalog queries.
 */
export function createPublicClient() {
  const { url, key } = getServerSupabaseEnv()
  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
