import Link from 'next/link'
import { notFound } from 'next/navigation'
import { assertAdminAccess } from '../../../../../src/lib/admin/products'
import { fetchOrderDetailForAdmin } from '../../../../../src/lib/orders/service'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import OrderDetailClient from '../OrderDetailClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar pedidos.</p>
      </AdminDenied>
    )
  }

  const { id } = await params
  let order = null
  let loadError = ''

  try {
    order = await fetchOrderDetailForAdmin(id)
  } catch {
    loadError = 'Não foi possível carregar o pedido. Tente novamente.'
  }

  if (!loadError && !order) notFound()

  return (
    <>
      <AdminPageHeader
        title={order ? `Pedido ${order.order_number}` : 'Pedido'}
        description="Detalhes, pagamento e histórico de status."
        actions={
          <Link href="/admin/pedidos" className="admin-btn admin-btn--ghost">
            Voltar aos pedidos
          </Link>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {order ? <OrderDetailClient order={order} /> : null}
    </>
  )
}
