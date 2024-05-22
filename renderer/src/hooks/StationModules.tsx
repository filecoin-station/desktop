import { useEffect, useState } from 'react'
import * as Name from 'w3name'

/**
 * @returns {Promise<string>} The contract address of the Spark module
 */
async function getSparkContractAddress () {
  const name = Name.parse(
    'k51qzi5uqu5dmaqrefqazad0ca8b24fb79zlacfjw2awdt5gjf2cr6jto5jyqe'
  )
  const revision = await Name.resolve(name)
  const address = revision.value.split('\n').filter(Boolean).pop()
  if (typeof address !== 'string') {
    throw new Error('Failed to resolve Spark contract address')
  }
  return address
}

/* eslint-disable max-len */
const modules = {
  spark: {
    name: 'Spark',
    description: 'With its array of tools, resources, and support, Spark empowers users to spark new ideas, projects, and solutions that harness the full potential of Filecoin\'s decentralized storage protocol.',
    contractAddress: '0x',
    logo: 'https://assets-global.website-files.com/633bfdb71d8e552b70ceff10/633eb29c75502c57fa5ff646_station-download.svg',
    stats: { // TODO: Get this from spark-stats once available
      totalJobs: 0,
      totalRewards: 0
    },
    links: {
      github: 'https://github.com/filecoin-station/spark',
      docs: 'https://filspark.com/'
    }
  },
  voyager: {
    name: 'Voyager',
    description: 'Module Y empowers users to spark new ideas, projects, and solutions that harness the full potential of Filecoin\'s decentralized storage protocol.',
    contractAddress: '0xc524b83bf85021e674a7c9f18f5381179fabaf6c',
    logo: 'https://assets-global.website-files.com/633bfdb71d8e552b70ceff10/633eb29c75502c0e935ff647_station-connect.svg',
    stats: {
      totalJobs: 0, // TODO: Updater after data export
      totalRewards: 0 // TODO: Update after airdrop
    },
    links: {
      github: 'https://github.com/filecoin-station/voyager',
      docs: 'https://filstation.app/'
    }
  }
}

export const useModules = () => {
  const [sparkStats] = useState<typeof modules.spark.stats>(modules.spark.stats)
  const [sparkContractAddress, setSparkContractAddress] = useState<string>()

  useEffect(() => {
    async function load () {
      setSparkContractAddress(await getSparkContractAddress())
    }
    load()
  }, [])

  const modulesUpdated = {
    ...modules,
    spark: {
      ...modules.spark,
      contractAddress: sparkContractAddress,
      stats: sparkStats
    }
  }

  return {
    modules: Object.entries(modulesUpdated).map(([id, mod]) => ({ ...mod, id }))
  }
}