import { getSupabaseEnvHealth } from '../../../../src/lib/supabase/env'

export const dynamic = 'force-dynamic'

/**
 * Safe env probe for Preview diagnostics — no secret values.
 * GET /api/admin/env-health
 */
export async function GET() {
  const health = getSupabaseEnvHealth()
  return Response.json(
    {
      ok: health.resolvedUrl && health.resolvedKey,
      health,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
