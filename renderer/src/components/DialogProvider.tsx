import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Root, Overlay, Portal, Content } from '@radix-ui/react-dialog'
import { useLocation } from 'react-router-dom'
import BorderedBox from './BorderedBox'

type OpenDialogOptions = {
  content: ReactNode;
}
type DialogContextType = {
  openDialog: (options: OpenDialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType>({} as DialogContextType)

export const DialogProvider = ({ children }: {children: ReactNode}) => {
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>()

  function openDialog (options: OpenDialogOptions) {
    setContent(options.content)
    setIsOpen(true)
  }

  function closeDialog () {
    setIsOpen(false)
  }

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <Root open={isOpen} onOpenChange={setIsOpen}>
        <Portal>
          <Overlay className='fixed inset-0 bg-[#00000055] backdrop-blur' data-dialog-overlay />
          <Content
            className='fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px]
                translate-x-[-50%] translate-y-[-50%] z-10'
          >
            {content}
          </Content>
        </Portal>
      </Root>
    </DialogContext.Provider>
  )
}

export function useDialog () {
  return useContext(DialogContext)
}
