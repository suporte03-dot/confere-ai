import './admin.css'
import './admin-shell.css'
import { readServerSupabaseEnv } from '../../src/lib/supabase/env'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin — Terra & Estilo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }) {
  const { url, key } = readServerSupabaseEnv()

  return (
    <div className="admin-root">
      {url && key ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__TE_SUPABASE_URL__=${JSON.stringify(url)};window.__TE_SUPABASE_KEY__=${JSON.stringify(key)};`,
          }}
        />
      ) : null}
      {children}
    </div>
  )
}
