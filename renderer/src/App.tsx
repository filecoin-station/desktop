import AppRoutes from './configs/Routes'
import './App.css'
import { ActivityLog } from './components/ActivityLog'
import { TotalJobsCompleted } from './components/TotalJobsCompleted'
import Saturn from './Saturn'

const App = ():JSX.Element => {
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

