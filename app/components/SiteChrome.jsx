'use client'

import { useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import { HEADER_ATMOSPHERE_SRC } from '../../src/data/homeData'
import { staticAssetCssUrl } from '../../src/utils/staticAssetSrc'
import Header from '../../src/components/home/Header'
import Footer from '../../src/components/home/Footer'
import CartDrawer from '../../src/components/CartDrawer'
import Toast from '../../src/components/Toast'
import ScrollToTop from '../../src/components/ScrollToTop'

/**
 * Next equivalent of Vite App.jsx SiteLayout + desktop-preview shell.
 * Admin routes render without the public storefront chrome.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const onMenuToggle = useCallback(() => setMenuOpen((v) => !v), [])
  const onSearchToggle = useCallback(() => setSearchOpen((v) => !v), [])
  const onNavClose = useCallback(() => setMenuOpen(false), [])

  if (pathname?.startsWith('/admin') || pathname === '/checkout') {
    return children
  }

  return (
    <div className="desktop-preview">
      <ScrollToTop />
      <div className="app" id="inicio">
        <div
          className="site-chrome"
          style={{ '--site-chrome-bg': staticAssetCssUrl(HEADER_ATMOSPHERE_SRC) }}
        >
          <header className="brand-header">
            <Header
              menuOpen={menuOpen}
              onMenuToggle={onMenuToggle}
              searchOpen={searchOpen}
              onSearchToggle={onSearchToggle}
              onNavClose={onNavClose}
            />
          </header>
        </div>
        {children}
        <Footer />
        <CartDrawer />
        <Toast />
      </div>
    </div>
  )
}
