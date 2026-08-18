import Link from 'next/link'
import { fetchStockAlerts } from '../../../../src/lib/admin/stock-alerts'
import AdminPageHeader from '../../components/AdminPageHeader'

export default async function AdminStockPage() {
  const stock = await fetchStockAlerts()
  const groups = [
    { key: 'out', title: 'Esgotado', items: stock.grouped.out },
    { key: 'critical', title: 'Estoque crítico', items: stock.grouped.critical },
    { key: 'low', title: 'Estoque baixo', items: stock.grouped.low },
  ]

  return (
    <>
      <AdminPageHeader
        title="Estoque"
        description="Acompanhe variantes que precisam de reposição."
      />
      {stock.summary.total === 0 ? (
        <p className="admin-muted">Nenhuma variante com estoque baixo ou esgotado.</p>
      ) : (
        groups.map((group) =>
          group.items.length ? (
            <section key={group.key} className="admin-stock-group">
              <h2>
                {group.title} <em>{group.items.length}</em>
              </h2>
              <ul className="admin-attention__list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.productName}</strong>
                      <span>
                        {[item.color, item.size && `Tam. ${item.size}`, `${item.stock} un.`]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                    {item.productId ? (
                      <Link
                        href={`/admin/produtos/${item.productId}?variante=${item.id}`}
                        className="admin-link-btn"
                      >
                        Ver produto
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )
      )}
    </>
  )
}
