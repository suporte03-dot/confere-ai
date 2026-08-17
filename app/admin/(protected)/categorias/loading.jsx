export default function AdminCategoriesLoading() {
  return (
    <div className="admin-shell admin-shell--wide">
      <section className="admin-panel" aria-busy="true">
        <p className="admin-loading" role="status">
          Carregando categorias…
        </p>
      </section>
    </div>
  )
}
