import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from '../pages/Welcome'
import Saturn from '../Saturn'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Saturn />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
