import { Helmet } from 'react-helmet-async'

const Plausible = () => {
  return (
    <Helmet>
      <script
        defer
        data-domain="app.station.filecoin.io"
        src="https://plausible.io/js/plausible.local.js"
      />
    </Helmet>
  )
}

export default Plausible
