import Link from 'next/link'

export default function AdminDenied({ title = 'Acesso negado', children }) {
  return (
    <section className="admin-panel admin-denied">
      <h1>{title}</h1>
      {children}
      <div className="admin-actions">
        <Link href="/admin/login" className="admin-btn">
          Ir para login
        </Link>
      </div>
    </section>
  )
}
