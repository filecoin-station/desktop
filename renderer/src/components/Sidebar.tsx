import { Link } from 'react-router-dom'
import { ROUTES } from 'src/lib/routes'
import HomeIcon from 'src/assets/img/icons/home.svg?react'
import ModulesIcon from 'src/assets/img/icons/modules.svg?react'
import WalletIcon from 'src/assets/img/icons/wallet-2.svg?react'
import SettingsIcon from 'src/assets/img/icons/settings.svg?react'
import Logo from 'src/assets/img/icons/logo-symbol.svg?react'

const links = [
  {
    href: ROUTES.dashboard,
    title: 'Dashboard',
    Icon: HomeIcon
  },
  {
    href: ROUTES.modules,
    title: 'Modules',
    Icon: ModulesIcon
  },
  {
    href: ROUTES.wallet,
    title: 'Wallet',
    Icon: WalletIcon
  },
  {
    href: ROUTES.settings,
    title: 'Settings',
    Icon: SettingsIcon
  }
]

const Sidebar = () => {
  return (
    <section className='pt-9 bg-[#F1F1F5] outline-r outline-[#A0A1BA] outline-dashed'>
      <div className='flex flex-col items-center gap-9 px-4 pt-5'>
        <Logo />
        <nav className='flex flex-col gap-2'>
            {links.map(({ href, title, Icon }) => (
              <Link to={href} key={href} className='p-3.5'>
                <Icon />
                {/* <span>{title}</span> */}
              </Link>
            ))}
        </nav>
      </div>
    </section>
  )
}

export default Sidebar
