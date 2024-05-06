import { ReactNode, createContext, useContext, useState } from 'react'
import { Root, Overlay, Portal, Content } from '@radix-ui/react-dialog'

type OpenDialogOptions = {
    content: ReactNode;
}
type DialogContextType = {
    openDialog: (options: OpenDialogOptions) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType>({} as DialogContextType)

export const DialogProvider = ({ children }: {children: ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>()

  function openDialog (options: OpenDialogOptions) {
    setContent(options.content)
    setIsOpen(true)
  }

  function closeDialog () {
    setIsOpen(false)
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <Root open={isOpen} onOpenChange={setIsOpen}>
        <Portal>
          <Overlay className='fixed inset-0 bg-[#00000055]' data-dialog-overlay />
            <Content
                className='fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px]
                translate-x-[-50%] translate-y-[-50%] bg-white p-[25px] z-10'
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
