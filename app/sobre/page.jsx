import AboutPage from '../../src/views/AboutPage'
import { buildPageMetadata } from '../../src/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Sobre',
  description:
    'A marca do agro brasileiro — elegância, origem e autenticidade em cada peça.',
  path: '/sobre',
})

export default function SobrePage() {
  return <AboutPage />
}
