import { ShopProvider } from './context/ShopContext'
import TopBar from './components/TopBar'
import Header from './components/Header'
import Hero from './components/Hero'
import HomeCategories from './components/HomeCategories'
import FeaturedProducts from './components/FeaturedProducts'
import BrandEditorial from './components/BrandEditorial'
import BrandValues from './components/BrandValues'
import CollectionBanner from './components/CollectionBanner'
import Benefits from './components/Benefits'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
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
          <HomeCategories />
          <FeaturedProducts />
          <BrandEditorial />
          <BrandValues />
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
