import { useCallback, useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { ShopProvider } from './context/ShopContext'
import { HEADER_ATMOSPHERE_SRC } from './data/homeData'
import Header from './components/home/Header'
import Footer from './components/home/Footer'
import CartDrawer from './components/CartDrawer'
import Toast from './components/Toast'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import CollectionsPage from './pages/CollectionsPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import StoresPage from './pages/StoresPage'
import './App.css'
import './home.css'
import './catalog.css'
import './preview.css'

function SiteLayout({
  menuOpen,
  setMenuOpen,
  searchOpen,
  setSearchOpen,
}) {
  const onMenuToggle = useCallback(() => setMenuOpen((v) => !v), [setMenuOpen])
  const onSearchToggle = useCallback(() => setSearchOpen((v) => !v), [setSearchOpen])
  const onNavClose = useCallback(() => setMenuOpen(false), [setMenuOpen])

  return (
    <div className="app" id="inicio">
      <div
        className="site-chrome"
        style={{ '--site-chrome-bg': `url(${HEADER_ATMOSPHERE_SRC})` }}
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
      <Outlet />
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
        <ScrollToTop />
        <Routes>
          <Route
            element={(
              <SiteLayout
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
              />
            )}
          >
            <Route index element={<HomePage />} />
            <Route path="feminino" element={<CategoryPage category="feminino" />} />
            <Route path="masculino" element={<CategoryPage category="masculino" />} />
            <Route path="calcados" element={<CategoryPage category="calcados" />} />
            <Route path="acessorios" element={<CategoryPage category="acessorios" />} />
            <Route path="colecoes" element={<CollectionsPage />} />
            <Route path="colecoes/:slug" element={<CollectionsPage />} />
            <Route path="sobre" element={<AboutPage />} />
            <Route path="lojas" element={<StoresPage />} />
            <Route path="contato" element={<ContactPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </ShopProvider>
    </div>
  )
}

export default App
