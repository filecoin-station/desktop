import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from 'src/lib/routes'
import HomeIcon from 'src/assets/img/icons/home.svg?react'
import ModulesIcon from 'src/assets/img/icons/modules.svg?react'
import WalletIcon from 'src/assets/img/icons/wallet.svg?react'
import SettingsIcon from 'src/assets/img/icons/settings.svg?react'
import MenuArrow from 'src/assets/img/icons/menu-arrow.svg?react'
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className='sticky top-0 group pt-9 bg-slate-50 outline-slate-400 outline-dashed outline-1'>
      <div className='flex flex-col items-center gap-9 px-4 pt-5'>
        <Logo />

        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='nav-button absolute right-0 top-16 translate-x-[50%] outline-slate-400
          opacity-0 group-hover:opacity-100 focus:opacity-100'
        >
          <div className={`text-primary ${isOpen ? 'rotate-180' : ''}`}>
            <MenuArrow />
          </div>
        </button>

        <nav className='flex flex-col gap-2'>
          {links.map(({ href, title, Icon }) => (
            <NavLink
              to={href}
              key={href}
              className={({ isActive }) =>
                `flex gap-2 items-center py-3.5 nav-button 
                  ${isOpen ? 'px-3' : 'px-3.5'} 
                  ${isActive ? 'active' : ''}`}
            >
              <Icon />
              <span className={`uppercase text-body-3xs ${isOpen ? 'block' : 'hidden'}`}>{title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </section>
  )
}

export default Sidebar
