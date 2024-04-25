import { Link } from 'react-router-dom'
import { ROUTES } from 'src/lib/routes'

const Sidebar = () => {
  return (
    <nav className='flex flex-col gap-4 mt-6 px-4'>
        <Link to={ROUTES.dashboard}>Dashboard</Link>
        <Link to={ROUTES.modules}>Modules</Link>
        <Link to={ROUTES.wallet}>Wallet</Link>
        <Link to={ROUTES.settings}>Settings</Link>
    </nav>
  )
}

export default Sidebar
