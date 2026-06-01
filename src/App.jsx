import { useState } from 'react'
import { ShopProvider } from './context/ShopContext'
import TopBar from './components/home/TopBar'
import Header from './components/home/Header'
import MainNavigation from './components/home/MainNavigation'
import TerraEstiloLogo from './components/home/TerraEstiloLogo'
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <ShopProvider>
      <div className="app">
        <div className="site-chrome">
          <div className="header-logo-area">
            <a
              href="#inicio"
              className="site-header__logo header-logo logo-container site-logo"
              aria-label="TerraEstilo — Página inicial"
            >
              <TerraEstiloLogo variant="header" />
            </a>
          </div>
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
          <CategoryShowcase />
          <FeaturedCollection />
          <ProductGrid />
          <BrandValues />
          <AboutBrand />
          <BenefitsBar />
          <Newsletter />
        </main>
        <Footer />
        <CartDrawer />
        <Toast />
      </div>
    </ShopProvider>
  )
}

export default App
