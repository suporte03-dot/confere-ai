import { useState } from 'react'
import { ShopProvider } from './context/ShopContext'
import TopBar from './components/home/TopBar'
import Header from './components/home/Header'
import MainNavigation from './components/home/MainNavigation'
import HeroSection from './components/home/HeroSection'
import CategoryShowcase from './components/home/CategoryShowcase'
import FeaturedCollection from './components/home/FeaturedCollection'
import ProductGrid from './components/home/ProductGrid'
import BrandValues from './components/home/BrandValues'
import AboutBrand from './components/home/AboutBrand'
import BenefitsBar from './components/home/BenefitsBar'
import Newsletter from './components/home/Newsletter'
import Footer from './components/home/Footer'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import './App.css'
import './home.css'
import './preview.css'

function SiteContent({ menuOpen, setMenuOpen, searchOpen, setSearchOpen, previewMode, setPreviewMode }) {
  return (
    <div className="app">
      <div className="site-chrome">
        <TopBar previewMode={previewMode} setPreviewMode={setPreviewMode} />
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
        <CategoryShowcase />
        <FeaturedCollection />
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
          <div className="preview-shell">
            <SiteContent
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
            />
          </div>
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
