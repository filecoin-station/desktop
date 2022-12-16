import { useEffect } from 'react'
import { startSaturnNode } from '../lib/station-config'

const Saturn = () => {
  useEffect(() => {
    startSaturnNode()
  }, [])

  return null
}

export default Saturn
