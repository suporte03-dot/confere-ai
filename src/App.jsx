import { useState, useCallback, useRef, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Examples from './components/Examples'
import ResultsTable from './components/ResultsTable'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Toast from './components/Toast'
import './App.css'

function App() {
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimeoutRef = useRef(null)

  const showToast = useCallback((message) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }
    setToastMessage(message)
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null)
      toastTimeoutRef.current = null
    }, 4000)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="app">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <Header />
      <main>
        <Hero showToast={showToast} />
        <Features />
        <HowItWorks />
        <Examples />
        <ResultsTable showToast={showToast} />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
