import { Helmet, HelmetProvider } from 'react-helmet-async'

const Plausible = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <script
          defer
          data-domain="app.station.filecoin.io"
          src="https://plausible.io/js/plausible.local.js"
        />
      </Helmet>
    </HelmetProvider>
  )
}

export default Plausible
