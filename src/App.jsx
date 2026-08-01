import { useState } from 'react'
import { ShopProvider } from './context/ShopContext'
import Header from './components/home/Header'
import HeroSection from './components/home/HeroSection'
import SectionDivider from './components/home/SectionDivider'
import NovidadesSection from './components/home/NovidadesSection'
import CategoryShowcase from './components/home/CategoryShowcase'
import FeaturedCollection from './components/home/FeaturedCollection'
import BestsellersSection from './components/home/BestsellersSection'
import BenefitsBar from './components/home/BenefitsBar'
import AboutBrand from './components/home/AboutBrand'
import BrandValues from './components/home/BrandValues'
import InstagramSection from './components/home/InstagramSection'
import Newsletter from './components/home/Newsletter'
import Footer from './components/home/Footer'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import './App.css'
import './home.css'
import './preview.css'

function SiteContent({
  menuOpen,
  setMenuOpen,
  searchOpen,
  setSearchOpen,
}) {
  return (
    <div className="app">
      <div className="site-chrome">
        <header className="brand-header">
          {/* Header unificado: logo + MainNavigation + busca/conta/carrinho */}
          <Header
            menuOpen={menuOpen}
            onMenuToggle={() => setMenuOpen((v) => !v)}
            searchOpen={searchOpen}
            onSearchToggle={() => setSearchOpen((v) => !v)}
            onNavClose={() => setMenuOpen(false)}
          />
        </header>
      </div>
      <HeroSection />
      <SectionDivider
        variant="light"
        showSaint
        className="section-divider--after-hero"
      />
      <main>
        <NovidadesSection />
        <SectionDivider variant="light" showSaint />
        <CategoryShowcase />
        <SectionDivider variant="dark" showSaint />
        <FeaturedCollection />
        <BestsellersSection />
        <SectionDivider variant="light" showSaint />
        <BenefitsBar />
        <AboutBrand />
        <BrandValues />
        <InstagramSection />
        <Newsletter />
        <SectionDivider variant="light" showSaint />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="desktop-preview">
      <ShopProvider>
        <SiteContent
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
        />
      </ShopProvider>
    </div>
  )
}

export default App
