import { createClient } from './server'
import { isAdminRole } from './roles'

/**
 * Server-side admin gate: validated user + profiles.role.
 * Does not load admin business data — only auth/role.
 */
export async function getAdminAccess() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { user: null, profile: null, allowed: false }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, full_name, name')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    const fallback = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (fallback.error || !fallback.data) {
      return { user, profile: null, allowed: false }
    }

    const allowed = isAdminRole(fallback.data.role)
    return { user, profile: fallback.data, allowed }
  }

  if (!profile) {
    return { user, profile: null, allowed: false }
  }

  const allowed = isAdminRole(profile.role)
  return { user, profile, allowed }
}
