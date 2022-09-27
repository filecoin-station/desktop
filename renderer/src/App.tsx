import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import Onboarding from './pages/Onboarding'
import WalletConfig from './pages/WalletConfig'
import Dashboard from './pages/Dashboard'
import Sentry from './components/Sentry'
import Plausible from './components/Plausible'
import { HelmetProvider } from 'react-helmet-async'

const App = ():JSX.Element => {
  useEffect(() => { document.title = 'Filecoin Station' })
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="*" element={
            <>
              <Sentry />
              <Plausible />
              <Routes>
                <Route path="/wallet" element={<WalletConfig />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </>
          }>
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App

