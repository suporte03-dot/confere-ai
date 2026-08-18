export default function AdminStockLoading() {
  return (
    <div className="admin-stock-skeleton" aria-busy="true" aria-live="polite">
      <div className="admin-skel admin-skel--title" />
      <div className="admin-skel admin-skel--copy" />
      <div className="admin-stock-stats">
        <div className="admin-skel admin-skel--stat" />
        <div className="admin-skel admin-skel--stat" />
        <div className="admin-skel admin-skel--stat" />
      </div>
      <div className="admin-skel admin-skel--board" />
      <span className="visually-hidden">Carregando estoque…</span>
    </div>
  )
}
