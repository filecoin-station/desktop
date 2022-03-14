import axios from 'axios'
import dateFormat from 'dateformat'
import get from 'lodash.get'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { API_URL } from '../constants'

const NetworkChart = dynamic(() => import('./NetworkChart'), { ssr: false })

const NetworkStats = () => {
  const [upload, setUpload] = useState(0)
  const [download, setDownload] = useState(0)
  const [items, setItems] = useState([])

  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)

  const { data } = useQuery(
    'NetworkStats',
    async ({ signal }) => {
      const res = await axios.post(`${API_URL}/station/rpc/v0`, {
        jsonrpc: '2.0',
        method: 'Station.BandwidthStats',
        id: 0
      })

      return res.data
    },
    {
      refetchInterval: 2000
    }
  )

  useEffect(() => {
    if (!data) return

    const uploadDelta = get(data, 'result.Upload', upload) - upload
    const downloadDelta = get(data, 'result.Download', download) - download

    setUploadSpeed(uploadDelta)
    setDownloadSpeed(downloadDelta)

    setUpload(get(data, 'result.Upload', upload))
    setDownload(get(data, 'result.Download', download))

    const newItems = items.slice(items.length >= 6 ? 1 : 0, 6)

    const now = new Date()
    setItems([
      ...newItems,
      {
        upload: uploadSpeed,
        download: downloadSpeed,
        name: dateFormat(now, 'isoTime')
      }
    ])
  }, [data])

  return (
    <div className='grid grid-cols-1 lg:grid-cols-1 gap-6'>
      <div className='flex h-72'>
        <NetworkChart data={items} />
      </div>
    </div>
  )
}

export default NetworkStats
