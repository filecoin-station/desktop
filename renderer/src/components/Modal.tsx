import { FC, ReactNode } from 'react'

interface IModal {
  isOpen: boolean,
  onClose: undefined | (() => void),
  children: ReactNode
}
const Modal: FC<IModal> = ({ isOpen, onClose, children }) => {
  const close = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    onClose && onClose()
  }

  return (
    <div
      data-testid="modal-element"
      tabIndex={-1}
      className={'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-20 h-full w-full md:inset-0 md:h-full justify-center items-center flex ' + (isOpen ? '' : 'hidden')}
      aria-modal="true" role="dialog">
      <div className="bg-gray-200/75 z-30 absolute top-0 right-0 left-0 bottom-0 backdrop-blur-sm"
        onClick={close}></div>
      <div className="bg-white p-6 z-40 min-w-[33%] max-w-2xl rounded-2xl flex justify-center">
        {children}
      </div>
    </div>
  )
}

export default Modal
