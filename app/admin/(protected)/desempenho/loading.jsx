export default function AdminDesempenhoLoading() {
  return (
    <div className="admin-stock-skeleton admin-perf-skeleton" aria-busy="true" aria-live="polite">
      <div className="admin-skel admin-skel--title" />
      <div className="admin-skel admin-skel--copy" />
      <div className="admin-stock-stats">
        <div className="admin-skel admin-skel--stat" />
        <div className="admin-skel admin-skel--stat" />
        <div className="admin-skel admin-skel--stat" />
        <div className="admin-skel admin-skel--stat" />
      </div>
      <div className="admin-skel admin-skel--board" />
      <div className="admin-skel admin-skel--board" />
      <span className="visually-hidden">Carregando desempenho…</span>
    </div>
  )
}
