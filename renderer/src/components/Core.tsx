import { useEffect } from 'react'
import { startCore } from '../lib/station-config'

const Core = () => {
  useEffect(() => {
    startCore()
  }, [])

  return null
}

export default Core
