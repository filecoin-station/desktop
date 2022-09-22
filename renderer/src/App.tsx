import './App.css'
import {
  Link, Route, Routes
} from 'react-router-dom'
import { ActivityLog } from './components/ActivityLog'
import Saturn from './Saturn'
import { TotalJobsCompleted } from './components/TotalJobsCompleted'
import { useEffect } from 'react'
import OnboardingPage from './pages/Onboarding'

const App = ():JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/saturn" element={<Saturn />} />
    </Routes>
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
