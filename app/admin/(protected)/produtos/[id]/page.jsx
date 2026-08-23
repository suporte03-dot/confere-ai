import Link from 'next/link'
import {
  assertAdminAccess,
  fetchActiveTaxonomies,
  fetchProductById,
} from '../../../../../src/lib/admin/products'
import AdminDenied from '../../../components/AdminDenied'
import AdminPageHeader from '../../../components/AdminPageHeader'
import HelpButton from '../../../components/help/HelpButton'
import ProductEditor from '../ProductEditor'

export const dynamic = 'force-dynamic'

export default async function AdminProductDetailPage({ params, searchParams }) {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para gerenciar produtos.</p>
      </AdminDenied>
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
      <>
        <AdminPageHeader title="Produto não encontrado" />
        <p>O item solicitado não existe ou não está disponível.</p>
        <Link href="/admin/produtos" className="admin-btn">
          Voltar à listagem
        </Link>
      </>
    )
  }

  return (
    <>
      <AdminPageHeader
        title={readOnly ? 'Visualizar produto' : 'Editar produto'}
        description={product?.name}
        actions={
          <>
            <HelpButton topic="produtos" showFirstVisit={false} />
            <Link href="/admin/produtos" className="admin-btn admin-btn--ghost">
              Cancelar
            </Link>
          </>
        }
      />
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
          highlightVariantId={resolvedSearch?.variante || ''}
        />
      ) : null}
    </>
  )
}
