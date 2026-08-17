import Link from 'next/link'
import {
  assertAdminAccess,
  fetchProductsForAdmin,
} from '../../../../src/lib/admin/products'
import { signOutAdmin } from '../../actions'
import ProductsListClient from './ProductsListClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel admin-denied">
          <h1>Acesso negado</h1>
          <p>Faça login com um perfil administrador para gerenciar produtos.</p>
          <div className="admin-actions">
            <Link href="/admin/login" className="admin-btn">
              Ir para login
            </Link>
          </div>
        </section>
      </div>
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
    <div className="admin-shell admin-shell--wide">
      <div className="admin-topbar">
        <div>
          <p className="admin-brand">
            Terra &amp; <span>Estilo</span>
          </p>
          <p className="admin-kicker">Produtos</p>
        </div>
        <div className="admin-actions admin-actions--compact">
          <Link href="/admin" className="admin-btn admin-btn--ghost">
            Voltar
          </Link>
          <form action={signOutAdmin}>
            <button type="submit" className="admin-btn admin-btn--ghost">
              Sair
            </button>
          </form>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <h1>Produtos</h1>
            <p>Gerencie o catálogo da loja com preços, variantes e fotos.</p>
          </div>
          <Link href="/admin/produtos/novo" className="admin-btn">
            + Novo produto
          </Link>
        </div>

        {loadError ? <p className="admin-error">{loadError}</p> : null}

        {!loadError ? <ProductsListClient products={products} /> : null}
      </section>
    </div>
  )
}
