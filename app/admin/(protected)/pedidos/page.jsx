import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchOrdersForAdmin } from '../../../../src/lib/orders/service'
import AdminDenied from '../../components/AdminDenied'
import AdminPageHeader from '../../components/AdminPageHeader'
import OrdersListClient from './OrdersListClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage({ searchParams }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar pedidos.</p>
      </AdminDenied>
    )
  }

  const resolved = await searchParams
  const status = resolved?.status || 'all'
  const q = resolved?.q || ''

  let orders = []
  let loadError = ''

  try {
    orders = await fetchOrdersForAdmin({
      status: status === 'all' ? null : status,
      q,
    })
  } catch {
    loadError = 'Não foi possível carregar os pedidos. Tente novamente.'
  }

  return (
    <>
      <AdminPageHeader
        title="Pedidos"
        description="Acompanhe pagamentos, preparação e envios da loja."
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError ? (
        <OrdersListClient
          orders={orders}
          initialQ={q}
          initialStatus={status}
        />
      ) : null}
    </>
  )
}
