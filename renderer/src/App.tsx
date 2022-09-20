import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
// import { ActivityLog } from './components/ActivityLog'
// import { TotalJobsCompleted } from './components/TotalJobsCompleted'

const App = ():JSX.Element => {
  useEffect(() => { document.title = 'Filecoin Station' })
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Saturn />} />
        <Route path="/" element={<WalletConfig />} />
      </Routes>
    </Router>
  )
}

export default App

// function Home (): JSX.Element {
//   useEffect(() => { document.title = 'Filecoin Station' })

//   return (
//     <div style={{ marginTop: '2em' }}>
//       <h2>Welcome to Filecoin Station</h2>
//       <TotalJobsCompleted />
//       <p><Link to='/saturn' id='link-to-saturn'> Saturn &gt;&gt;</Link></p>
//       <ActivityLog />
//     </div>
//   )
// }
