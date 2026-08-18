import { ADMIN_COVER_SRC, ADMIN_LOGO_SRC } from '../../../src/lib/admin/account'

export default function AdminAuthLayout({ children, caption = 'A marca do agro brasileiro' }) {
  return (
    <div className="admin-login">
      <aside
        className="admin-login__cover"
        style={{ '--admin-login-image': `url("${ADMIN_COVER_SRC}")` }}
      >
        <div className="admin-login__shade" aria-hidden="true" />
        <img src={ADMIN_LOGO_SRC} alt="Terra & Estilo" />
        {caption ? <p>{caption}</p> : null}
      </aside>
      <section className="admin-login__panel">{children}</section>
    </div>
  )
}
