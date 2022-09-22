import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import WalletConfig from './pages/WalletConfig'

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
