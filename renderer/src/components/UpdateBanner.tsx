import { useEffect, useState } from 'react'
import { ReactComponent as Warning } from '../assets/img/icons/error.svg'
import { openReleaseNotes, restartToUpdate } from '../lib/station-config'

const UpdateBanner = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false)

  useEffect(() => {
    const reload = async () => {
      const updateStatus = await window.electron.getUpdaterStatus()
      setIsUpdateAvailable(updateStatus.updateAvailable)
    }

    reload()
    const unsubscribeUpdateNotification = window.electron.stationEvents.onUpdateAvailable(() => {
      setIsUpdateAvailable(true)
    })

    return unsubscribeUpdateNotification
  }, [])

  if (!isUpdateAvailable) return null
  return (
    <div className="h-14 bg-black top-0 left-0 w-full">
      <div className="h-full max-w-[844px] mx-auto flex flex-row items-center justify-between">
        <div className='flex flex-row items-center gap-1'>
          <Warning width={'12px'} height={'12px'} fill="none" stroke="#fff" />
          <span className='text-white text-body-xs'>
            New version available: Station will update itself on next launch.
          </span>
        </div>
        <div>
          <span onClick={openReleaseNotes}
            className="font-body text-body-xs underline mr-3 text-white hover:text-grayscale-100 cursor-pointer">
            Release notes
          </span>
          <button
            className='py-2 px-8 rounded-full font-body text-body-2xs border border-solid
         text-white hover:bg-grayscale-100 hover:bg-opacity-30 bg-transparent'
            onClick={restartToUpdate}>Restart now</button>
        </div>
      </div>
    </div>
  )
}

export default UpdateBanner
