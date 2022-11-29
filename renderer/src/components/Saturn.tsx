import { useEffect } from 'react'
import { getDestinationWalletAddress, startSaturnNode } from '../lib/station-config'

const Saturn = () => {
  useEffect(() => {
    (async () => {
      if (await getDestinationWalletAddress()) {
        startSaturnNode()
      }
    })()
  }, [])

  return null
}

export default Saturn
