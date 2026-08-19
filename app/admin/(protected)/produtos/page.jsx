import Link from 'next/link'
import { assertAdminAccess, fetchProductsForAdmin } from '../../../../src/lib/admin/products'
import AdminDenied from '../../components/AdminDenied'
import AdminPageHeader from '../../components/AdminPageHeader'
import ProductsListClient from './ProductsListClient'
import { AdminIcon } from '../../components/AdminIcons'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar produtos.</p>
      </AdminDenied>
    )
  }

  let products = []
  let loadError = ''

  try {
    products = await fetchProductsForAdmin()
  } catch {
    loadError = 'Não foi possível carregar os produtos. Tente novamente.'
  }

  return (
    <>
      <AdminPageHeader
        title="Produtos"
        description="Gerencie o catálogo da loja com preços, variantes e fotos."
        actions={
          <Link href="/admin/produtos/novo" className="admin-btn">
            <AdminIcon name="plus" />
            Novo produto
          </Link>
        }
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {!loadError ? <ProductsListClient products={products} /> : null}
    </>
  )
}
