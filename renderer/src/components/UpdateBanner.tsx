import { useEffect, useState } from 'react'
import { ReactComponent as Warning } from '../assets/img/error.svg'
import { restartStation } from '../lib/station-config'

const UpdateBanner = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribeUpdateNotification = window.electron.stationEvents.onUpdateAvailable(() => {
      setIsUpdateAvailable(true)
    })

    return () => {
      unsubscribeUpdateNotification()
    }
  }, [])

  if (!isUpdateAvailable) return null
  return (
    <div className="h-14 bg-black top-0 left-0 w-full">
      <div className="h-full max-w-[744px] mx-auto flex flex-row items-center justify-between">
        <div className='flex flex-row items-center gap-1'>
        <Warning width={'12px'} height={'12px'} fill="none" stroke="#fff" />
        <span className='text-white text-body-xs'>
          The new version will launch the next time you start Station.
        </span>
        </div>
        <button
          className='py-2 px-8 rounded-full font-body text-body-2xs border border-solid
         text-white hover:bg-grayscale-100 hover:bg-opacity-30 bg-transparent'
          onClick={restartStation}>Restart now</button>
      </div>
    </div>
  )
}

export default UpdateBanner
