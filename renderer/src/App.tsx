import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'
import WalletConfig from './pages/WalletConfig'
import Saturn from './Saturn'
// import { ActivityLog } from './components/ActivityLog'
// import { TotalJobsCompleted } from './components/TotalJobsCompleted'

const App = ():JSX.Element => {
  useEffect(() => { document.title = 'Filecoin Station' })
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/wallet" element={<WalletConfig />} />
        <Route path="/dashboard" element={<Saturn />} />
      </Routes>
    </Router>
  )
}

export default App

