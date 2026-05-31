import { ShopProvider } from './context/ShopContext'
import TopBar from './components/TopBar'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import ProductShowcase from './components/ProductShowcase'
import CollectionBanner from './components/CollectionBanner'
import Benefits from './components/Benefits'
import Newsletter from './components/Newsletter'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Toast from './components/Toast'
import './App.css'

function App() {
  return (
    <ShopProvider>
      <div className="app">
        <TopBar />
        <Header />
        <main>
          <Hero />
          <CategoryGrid />
          <ProductShowcase />
          <CollectionBanner />
          <Benefits />
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
