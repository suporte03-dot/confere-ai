import { notFound } from 'next/navigation'
import OrderPaymentClient from './OrderPaymentClient'
import { fetchOrderByPublicToken } from '../../../src/lib/orders/service'
import {
  fetchStoreSettings,
  toPublicPaymentSettings,
} from '../../../src/lib/store/settings'
import { NOINDEX_ROBOTS } from '../../../src/lib/seo/site'
import '../../checkout/checkout.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { token } = await params
  const result = await fetchOrderByPublicToken(token)
  return {
    title: result.ok ? `Pedido ${result.order.order_number}` : 'Pedido',
    robots: NOINDEX_ROBOTS,
  }
}

export default async function PedidoPage({ params }) {
  const { token } = await params
  const result = await fetchOrderByPublicToken(token)
  if (!result.ok) notFound()

  const settings = await fetchStoreSettings()
  const payment = toPublicPaymentSettings(settings)

  return (
    <main className="order-pay-page">
      <div className="order-pay-page__inner">
        <OrderPaymentClient order={result.order} payment={payment} />
      </div>
    </main>
  )
}
