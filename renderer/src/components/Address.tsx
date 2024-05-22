import { truncateString } from 'src/lib/utils'
import Text from './Text'
import CopyIcon from 'src/assets/img/icons/copy.svg?react'
import Tooltip from './Tooltip'
import { useRef, useState } from 'react'

const Address = ({
  address
}: {
    address: string;
}) => {
  const [copyText, setCopyText] = useState('Copy')
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()

    navigator.clipboard.writeText(address)
    setCopyText('Copied')

    setTimeout(() => {
      setCopyText('Copy')
      triggerRef.current?.blur()
    }, 700)
  }

  return (
    <div className='w-fit flex gap-1 items-center p-1 rounded-sm'>
      <Tooltip
        content={copyText}
        keepOpenOnClick
        trigger={
          <button
            ref={triggerRef}
            onClick={handleClick}
            type='button'
            className='hover:bg-slate-100 focus:bg-slate-100 focus:ring-0 focus-visible:outline-none'
          >
            <CopyIcon />
          </button>
        }
      />
      <Tooltip
        content={address}
        trigger={
          <div className='leading-none hover:bg-slate-100 focus:bg-slate-100
                          focus:ring-0 focus-visible:outline-none'
          >
            <Text size="s">{truncateString(address)}</Text>
          </div>
        }
      />
    </div>
  )
}

export default Address
