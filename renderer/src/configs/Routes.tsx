import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Onboarding from '../pages/Onboarding'
import Saturn from '../Saturn'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Saturn />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
