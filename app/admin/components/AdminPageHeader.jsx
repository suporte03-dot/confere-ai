export default function AdminPageHeader({ title, description, actions }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
    </div>
  )
}
