import { assertAdminAccess } from '../../../../src/lib/admin/products'
import {
  fetchOrderDashboardStats,
  fetchOrdersForAdmin,
} from '../../../../src/lib/orders/service'
import AdminDenied from '../../components/AdminDenied'
import AdminPageHeader from '../../components/AdminPageHeader'
import HelpButton from '../../components/help/HelpButton'
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
  const payment = resolved?.payment || 'all'
  const period = resolved?.period || 'all'
  const dateFrom = resolved?.from || ''
  const dateTo = resolved?.to || ''
  const sort = resolved?.sort || 'newest'

  let orders = []
  let stats = null
  let loadError = ''

  try {
    ;[orders, stats] = await Promise.all([
      fetchOrdersForAdmin({
        status: status === 'all' ? null : status,
        q,
        payment,
        period,
        dateFrom,
        dateTo,
        sort,
      }),
      fetchOrderDashboardStats(),
    ])
  } catch {
    loadError = 'Não foi possível carregar os pedidos. Tente novamente.'
  }

  return (
    <>
      <AdminPageHeader
        title="Pedidos"
        description="Acompanhe pagamentos, preparação e envios da loja."
        actions={<HelpButton topic="pedidos" />}
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError ? (
        <OrdersListClient
          orders={orders}
          stats={stats}
          initialQ={q}
          initialStatus={status}
          initialPayment={payment}
          initialPeriod={period}
          initialDateFrom={dateFrom}
          initialDateTo={dateTo}
          initialSort={sort}
        />
      ) : null}
    </>
  )
}
