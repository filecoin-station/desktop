import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import Dashboard from '../pages/Dashboard'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/address" element={<Welcome />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
