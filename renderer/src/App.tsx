import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import WalletConfig from './pages/WalletConfig'

const App = ():JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<WalletConfig />} />
      </Routes>
    </Router>
  )
}

export default App
