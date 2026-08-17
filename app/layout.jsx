import './globals.css'
import Providers from './providers'
import SiteChrome from './components/SiteChrome'
import {
  listActiveCategories,
  listActiveCollections,
  listActiveProducts,
} from '../src/lib/catalog'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Terra & Estilo — A marca do agro brasileiro',
  description:
    'Terra & Estilo — A marca do agro brasileiro. Moda premium com identidade, elegância e autenticidade.',
  icons: {
    icon: '/favicon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }) {
  const [products, categories, collections] = await Promise.all([
    listActiveProducts(),
    listActiveCategories(),
    listActiveCollections(),
  ])

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers products={products} categories={categories} collections={collections}>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  )
}
