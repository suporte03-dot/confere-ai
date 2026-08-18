import { fetchStockAlerts } from '../../../../src/lib/admin/stock-alerts'
import AdminPageHeader from '../../components/AdminPageHeader'
import StockMonitor from './StockMonitor'

export const dynamic = 'force-dynamic'

export default async function AdminStockPage() {
  const stock = await fetchStockAlerts()

  return (
    <>
      <AdminPageHeader
        title="Estoque"
        description="Acompanhe peças e variações que precisam de atenção."
      />
      <StockMonitor
        alerts={stock.alerts}
        summary={stock.summary}
        loadError={stock.ok ? '' : stock.error}
      />
    </>
  )
}
