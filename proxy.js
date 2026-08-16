import { updateSession } from './src/lib/supabase/proxy'

export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
