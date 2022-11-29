import { FC } from 'react'
import WalletModule from '../components/WalletModule'

interface ModalProps {
  isOpen: boolean
  setIsOpen: () => void
}
const Modal : FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
    <div className={`fixed h-full w-full bg-primary transition-all duration-[800ms] ease-in-out ${isOpen ? 'z-30 opacity-20 visible' : 'opacity-0 z-[25] invisible'}`} onClick={setIsOpen} />
    <div className={`fixed z-30  w-[744px] h-full bg-white transition-all duration-[800ms] ease-in-out ${isOpen ? 'right-0' : '-right-[744px] invisible'}`} >
      <WalletModule isOpen={isOpen} />
    </div>
    </>
  )
}

export default Modal
