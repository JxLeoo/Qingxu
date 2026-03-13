import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider } from './store'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'

// Obsess scenario
import ObsessInputPage from './pages/obsess/ObsessInputPage'
import ObsessSealPage from './pages/obsess/ObsessSealPage'
import ObsessDonePage from './pages/obsess/ObsessDonePage'

// Insomnia scenario
import InsomniaRelaxPage from './pages/insomnia/InsomniaRelaxPage'
import InsomniaSleepPage from './pages/insomnia/InsomniaSleepPage'
import InsomniaDonePage from './pages/insomnia/InsomniaDonePage'

// Emotion scenario

import EmotionIntroPage from './pages/emotion/EmotionIntroPage';
import EmotionReleasePage from './pages/emotion/EmotionReleasePage'
import EmotionDonePage from './pages/emotion/EmotionDonePage'

import { useEffect } from 'react'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()

  // Handle URL params for passive trigger (future use)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const trigger = params.get('trigger')
    if (trigger) {
      if (trigger === 'sleep' || trigger === 'night') {
        navigate('/insomnia/relax')
      }
    }
  }, [navigate])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
        <Route path="/stats" element={<StatsPage />} />

        {/* Obsess Scenario */}
        <Route path="/obsess/input" element={<ObsessInputPage />} />
        <Route path="/obsess/seal" element={<ObsessSealPage />} />
        <Route path="/obsess/done" element={<ObsessDonePage />} />

        {/* Insomnia Scenario */}
        <Route path="/insomnia/relax" element={<InsomniaRelaxPage />} />
        <Route path="/insomnia/sleep" element={<InsomniaSleepPage />} />
        <Route path="/insomnia/done" element={<InsomniaDonePage />} />

        {/* Emotion Scenario */}
        <Route path="/emotion/intro" element={<EmotionIntroPage />} />
        <Route path="/emotion/release" element={<EmotionReleasePage />} />
        <Route path="/emotion/done" element={<EmotionDonePage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
