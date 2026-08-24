import StoresPage from '../../src/views/StoresPage'
import { buildPageMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Lojas',
  description:
    'Atendimento online para todo o Brasil — e em breve novos pontos físicos na Serra Gaúcha.',
  path: '/lojas',
})

export default function LojasPage() {
  return <StoresPage />
}
