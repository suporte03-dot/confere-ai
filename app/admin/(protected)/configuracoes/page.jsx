import { assertAdminAccess } from '../../../../src/lib/admin/products'
import { fetchStoreSettings } from '../../../../src/lib/store/settings'
import AdminDenied from '../../components/AdminDenied'
import AdminPageHeader from '../../components/AdminPageHeader'
import StoreSettingsForm from './StoreSettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const gate = await assertAdminAccess()
  if (!gate.ok) {
    return (
      <AdminDenied>
        <p>Faça login com um perfil administrador para editar as configurações.</p>
      </AdminDenied>
    )
  }

  let settings = null
  let loadError = ''

  try {
    settings = await fetchStoreSettings()
  } catch {
    loadError = 'Não foi possível carregar as configurações. Tente novamente.'
  }

  return (
    <>
      <AdminPageHeader
        title="Configurações"
        description="Pix, contatos e parâmetros operacionais da loja."
      />
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {settings ? <StoreSettingsForm settings={settings} /> : null}
    </>
  )
}
