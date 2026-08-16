export default function AdminProductsLoading() {
  return (
    <div className="admin-shell admin-shell--wide">
      <section className="admin-panel" aria-busy="true">
        <p className="admin-loading" role="status">
          Carregando produtos…
        </p>
      </section>
    </div>
  )
}
