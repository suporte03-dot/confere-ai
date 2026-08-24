import ContactPage from '../../src/views/ContactPage'
import { buildPageMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Contato',
  description:
    'Estamos próximos antes e depois da compra — tire dúvidas, acompanhe pedidos ou conheça nossas lojas.',
  path: '/contato',
})

export default function ContatoPage() {
  return <ContactPage />
}
