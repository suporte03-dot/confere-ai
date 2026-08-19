import './admin.css'
import './admin-shell.css'
import { getServerSupabaseEnv } from '../../src/lib/supabase/env'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin — Terra & Estilo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }) {
  const { url, key } = getServerSupabaseEnv()

  return (
    <div className="admin-root">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__TE_SUPABASE_URL__=${JSON.stringify(url)};window.__TE_SUPABASE_KEY__=${JSON.stringify(key)};`,
        }}
      />
      {children}
    </div>
  )
}
