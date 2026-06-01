import LandingHeader from './components/landing/LandingHeader'
import LandingHero from './components/landing/LandingHero'
import BrandShowcase from './components/landing/BrandShowcase'
import ColorPalette from './components/landing/ColorPalette'
import AboutSection from './components/landing/AboutSection'
import LandingFooter from './components/landing/LandingFooter'
import './landing.css'

function App() {
  return (
    <div className="lp-app">
      <LandingHeader />
      <main>
        <LandingHero />
        <BrandShowcase />
        <ColorPalette />
        <AboutSection />
      </main>
      <LandingFooter />
    </div>
  )
}

export default App
