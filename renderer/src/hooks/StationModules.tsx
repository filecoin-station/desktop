import { useEffect, useState } from 'react'
import { mockData } from 'src/pages/modules/mockData'

// Using mock data
async function getAllModules () {
  return mockData
}

type Module = typeof mockData[number]

export const useModules = () => {
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    async function loadStoredInfo () {
      setModules(await getAllModules())
    }
    loadStoredInfo()
  }, [])

  return {
    modules
  }
}
