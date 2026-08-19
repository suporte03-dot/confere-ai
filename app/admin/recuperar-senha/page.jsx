import AdminAuthLayout from '../components/AdminAuthLayout'
import RecoverPasswordForm from './RecoverPasswordForm'

export const dynamic = 'force-dynamic'

export default function RecoverPasswordPage() {
  return (
    <AdminAuthLayout>
      <RecoverPasswordForm />
    </AdminAuthLayout>
  )
}
