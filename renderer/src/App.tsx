import './App.css'
import {
  Routes,
  Route,
  Link
} from 'react-router-dom'

function App (): JSX.Element {
  return (
    <div className='App'>
      <header>
        <h1>Filecoin Station</h1>
      </header>
      <main className='App-header'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/saturn' element={<Saturn />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

function Home (): JSX.Element {
  return (
    <div>
      <div className='logo'>🛰</div>
      <h2>Welcome to Filecoin Station</h2>
      <p><Link to='/saturn'> Saturn &gt;&gt;</Link></p>
    </div>
  )
}

function Saturn (): JSX.Element {
  return (
    <div>
      <div className='logo'>🪐</div>
      <h2>Welcome to Saturn</h2>
      <p><Link to='/'>Station &gt;&gt;</Link></p>
    </div>
  )
}
