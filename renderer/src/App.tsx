import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Onboarding from './pages/Onboarding'
import WalletConfig from './pages/WalletConfig'
import Saturn from './Saturn'
import { TotalJobsCompleted } from './components/TotalJobsCompleted'
import { ActivityLog } from './components/ActivityLog'
import Sentry from './components/Sentry'
import Plausible from './components/Plausible'
import { HelmetProvider, Helmet } from 'react-helmet-async'

const App = ():JSX.Element => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Filecoin Station</title>
      </Helmet>
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
                <Route path="/saturn" element={<Saturn />} />
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

function Dashboard (): JSX.Element {
  return (
    <div style={{ marginTop: '2em' }}>
      <h2>Welcome to Filecoin Station</h2>
      <TotalJobsCompleted />
      <p><Link to='/saturn' id='link-to-saturn'> Saturn &gt;&gt;</Link></p>
      <ActivityLog />
    </div>
  )
}
