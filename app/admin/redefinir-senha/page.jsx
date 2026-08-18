import AdminAuthLayout from '../components/AdminAuthLayout'
import ResetPasswordForm from './ResetPasswordForm'

export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  return (
    <AdminAuthLayout>
      <ResetPasswordForm />
    </AdminAuthLayout>
  )
}
