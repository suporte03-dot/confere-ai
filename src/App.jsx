import { useState } from 'react'
import { ShopProvider } from './context/ShopContext'
import TopBar from './components/home/TopBar'
import Header from './components/home/Header'
import MainNavigation from './components/home/MainNavigation'
import HeroSection from './components/home/HeroSection'
import CollectionVitrine from './components/home/CollectionVitrine'
import ProductGrid from './components/home/ProductGrid'
import BrandValues from './components/home/BrandValues'
import AboutBrand from './components/home/AboutBrand'
import BenefitsBar from './components/home/BenefitsBar'
import Newsletter from './components/home/Newsletter'
import Footer from './components/home/Footer'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import PreviewControls from './components/PreviewControls'
import './App.css'
import './home.css'
import './preview.css'

function SiteContent({
  menuOpen,
  setMenuOpen,
  searchOpen,
  setSearchOpen,
  previewMode,
  setPreviewMode,
  showPreviewControls = true,
}) {
  return (
    <div className="app">
      <div className="site-chrome">
        {showPreviewControls && (
          <PreviewControls previewMode={previewMode} setPreviewMode={setPreviewMode} />
        )}
        <TopBar />
        <Header
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((v) => !v)}
          searchOpen={searchOpen}
          onSearchToggle={() => setSearchOpen((v) => !v)}
        />
        <MainNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
      <main>
        <HeroSection />
        <CollectionVitrine />
        <ProductGrid />
        <AboutBrand />
        <BrandValues />
        <BenefitsBar />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  )
}

function App() {
  const [previewMode, setPreviewMode] = useState('desktop')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const previewClass = previewMode === 'mobile' ? 'mobile-preview' : 'desktop-preview'

  return (
    <div className={previewClass}>
      <ShopProvider>
        {previewMode === 'mobile' ? (
          <>
            <PreviewControls previewMode={previewMode} setPreviewMode={setPreviewMode} />
            <div className="preview-shell">
              <SiteContent
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                showPreviewControls={false}
              />
            </div>
          </>
        ) : (
          <SiteContent
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
          />
        )}
      </ShopProvider>
    </div>
  )
}

export default App
