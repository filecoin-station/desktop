import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WalletConfig from '../pages/WalletConfig'
import Saturn from '../Saturn'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Saturn />} />
        <Route path="/wallet" element={<WalletConfig />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
