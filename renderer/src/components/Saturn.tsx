import { useEffect } from 'react'
import { getFilAddress, startSaturnNode } from '../lib/station-config'

const Saturn = () => {
  useEffect(() => {
    (async () => {
      if (await getFilAddress()) {
        startSaturnNode()
      }
    })()
  }, [])

  return null
}

export default Saturn
