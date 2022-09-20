import AppRoutes from './configs/Routes'
import './App.css'
import { ActivityLog } from './components/ActivityLog'
import { TotalJobsCompleted } from './components/TotalJobsCompleted'
import Saturn from './Saturn'

const App = ():JSX.Element => {
  return (
    <AppRoutes />
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
