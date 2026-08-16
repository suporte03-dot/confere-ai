import Link from 'next/link'
import {
  assertAdminAccess,
  fetchActiveTaxonomies,
  fetchProductById,
} from '../../../../../src/lib/admin/products'
import { signOutAdmin } from '../../../actions'
import ProductEditor from '../ProductEditor'

export const dynamic = 'force-dynamic'

export default async function AdminProductDetailPage({ params, searchParams }) {
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

  const resolvedParams = await params
  const resolvedSearch = await searchParams
  const id = resolvedParams?.id
  const readOnly = resolvedSearch?.modo === 'ver'

  let product = null
  let categories = []
  let collections = []
  let loadError = ''

  try {
    const [loaded, taxonomies] = await Promise.all([
      fetchProductById(id),
      fetchActiveTaxonomies(),
    ])
    product = loaded
    categories = taxonomies.categories
    collections = taxonomies.collections

    // Keep currently assigned taxonomy options even if inactive.
    if (product?.category?.id && !categories.some((c) => c.id === product.category.id)) {
      categories = [...categories, product.category]
    }
    if (
      product?.collection?.id &&
      !collections.some((c) => c.id === product.collection.id)
    ) {
      collections = [...collections, product.collection]
    }
  } catch {
    loadError = 'Não foi possível carregar o produto.'
  }

  if (!loadError && !product) {
    return (
      <div className="admin-shell admin-shell--wide">
        <section className="admin-panel">
          <h1>Produto não encontrado</h1>
          <p>O item solicitado não existe ou não está disponível.</p>
          <div className="admin-actions">
            <Link href="/admin/produtos" className="admin-btn">
              Voltar à listagem
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="admin-shell admin-shell--wide">
      <div className="admin-topbar">
        <div>
          <p className="admin-brand">
            Terra &amp; <span>Estilo</span>
          </p>
          <p className="admin-kicker">{readOnly ? 'Visualizar' : 'Editar'}</p>
        </div>
        <div className="admin-actions admin-actions--compact">
          <Link href="/admin/produtos" className="admin-btn admin-btn--ghost">
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
        {loadError ? <p className="admin-error">{loadError}</p> : null}
        {!loadError && product ? (
          <ProductEditor
            key={`${product.id}-${product.updated_at}-${(product.product_images || [])
              .map((img) => `${img.id}:${img.storage_path}:${img.is_cover}:${img.position}`)
              .join('|')}`}
            mode={readOnly ? 'view' : 'edit'}
            readOnly={readOnly}
            product={product}
            categories={categories}
            collections={collections}
          />
        ) : null}
      </section>
    </div>
  )
}
