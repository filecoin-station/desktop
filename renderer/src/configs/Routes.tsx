import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import WalletConfig from '../pages/WalletConfig'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/wallet" element={<WalletConfig />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
