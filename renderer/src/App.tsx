import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Onboarding from './pages/Onboarding'
import WalletConfig from './pages/WalletConfig'
import Dashboard from './pages/Dashboard'
import Sentry from './components/Sentry'
import Plausible from './components/Plausible'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Saturn from './components/Saturn'

const App = ():JSX.Element => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Filecoin Station</title>
      </Helmet>
      <Saturn />
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
