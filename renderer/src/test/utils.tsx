import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { DialogProvider } from 'src/components/DialogProvider'
import Layout from 'src/components/Layout'
import { ReactNode } from 'react'

export function renderApp (children: ReactNode) {
  render((
    <BrowserRouter>
      <TooltipProvider>
        <DialogProvider>
          <Layout>
            {children}
          </Layout>
        </DialogProvider>
      </TooltipProvider>
    </BrowserRouter>
  ))
}
