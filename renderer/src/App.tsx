import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import OnboardingPage from './pages/Onboarding'
import { ActivityLog } from './components/ActivityLog'
import { TotalJobsCompleted } from './components/TotalJobsCompleted'
import Saturn from './Saturn'
import { useEffect } from 'react'

const App = ():JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saturn" element={<Saturn />} />
      </Routes>
    </Router>
  )
}

export default App

function Dashboard (): JSX.Element {
  useEffect(() => { document.title = 'Filecoin Station' })

  return (
    <div style={{ marginTop: '2em' }}>
      <h2>Welcome to Filecoin Station</h2>
      <TotalJobsCompleted />
      <p><Link to='/saturn' id='link-to-saturn'> Saturn &gt;&gt;</Link></p>
      <ActivityLog />
    </div>
  )
}

