import './admin.css'
import './admin-shell.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin — Terra & Estilo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }) {
  return <div className="admin-root">{children}</div>
}
