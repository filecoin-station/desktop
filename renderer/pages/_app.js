import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from 'react-query'

import '../styles/globals.css'

const queryClient = new QueryClient()

function MyApp ({ Component, pageProps }) {
  return (
    <ThemeProvider attribute='class'>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp
