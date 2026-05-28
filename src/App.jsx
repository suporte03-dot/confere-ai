import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Examples from './components/Examples'
import ResultsTable from './components/ResultsTable'
import CTA from './components/CTA'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Examples />
        <ResultsTable />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
