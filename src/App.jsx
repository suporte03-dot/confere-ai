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
import {
  analyzeFiles,
  computeAnalysisStats,
  computeAnalysisInsights,
  createUploadedFileEntry,
  mergeUploadedFiles,
} from './utils/fileAnalysis'
import './App.css'

function App() {
  const [toastMessage, setToastMessage] = useState(null)
  const toastTimeoutRef = useRef(null)

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [analysisResults, setAnalysisResults] = useState(null)
  const [analysisStats, setAnalysisStats] = useState(null)
  const [analysisInsights, setAnalysisInsights] = useState(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasRealAnalysis, setHasRealAnalysis] = useState(false)

  const showToast = useCallback((message) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current)
    }
    setToastMessage(message)
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null)
      toastTimeoutRef.current = null
    }, 4500)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const handleAddFiles = useCallback((fileList) => {
    const entries = Array.from(fileList).map((file, index) => createUploadedFileEntry(file, index))
    setUploadedFiles((prev) => mergeUploadedFiles(prev, entries))
    setHasRealAnalysis(false)
    setAnalysisResults(null)
    setAnalysisStats(null)
    setAnalysisInsights(null)
    setAnalysisProgress(0)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      showToast('Selecione ao menos um arquivo para iniciar a análise.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.status === 'Não suportado' ? file : { ...file, status: 'Processando' },
      ),
    )

    try {
      const results = await analyzeFiles(uploadedFiles, (progress, fileId, result) => {
        setAnalysisProgress(progress)
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === fileId ? { ...file, status: result.fileStatus || 'Concluído' } : file,
          ),
        )
      })

      const stats = computeAnalysisStats(uploadedFiles, results)
      const insights = computeAnalysisInsights(stats, results)

      setAnalysisResults(results)
      setAnalysisStats(stats)
      setAnalysisInsights(insights)
      setHasRealAnalysis(true)
      setAnalysisProgress(100)
      showToast('Análise concluída. Confira os resultados abaixo.')

      window.setTimeout(() => {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } catch {
      showToast('Não foi possível concluir a análise. Tente novamente.')
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.status === 'Processando' ? { ...file, status: 'Aguardando análise' } : file,
        ),
      )
    } finally {
      setIsAnalyzing(false)
    }
  }, [uploadedFiles, showToast])

  return (
    <div className="app">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      <Header />
      <main>
        <Hero
          showToast={showToast}
          uploadedFiles={uploadedFiles}
          onAddFiles={handleAddFiles}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          analysisProgress={analysisProgress}
          analysisStats={analysisStats}
        />
        <Features />
        <HowItWorks />
        <Examples />
        <ResultsTable
          showToast={showToast}
          hasRealAnalysis={hasRealAnalysis}
          analysisResults={analysisResults}
          analysisStats={analysisStats}
          analysisInsights={analysisInsights}
        />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
