import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import OnboardingPage from './pages/Onboarding'
import Saturn from './Saturn'

const App = ():JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<Saturn />} />
      </Routes>
    </Router>
  )
}

export default App
