import classNames from 'classnames'
import { ComponentPropsWithRef } from 'react'
import Text from './Text'
import WarningIcon from 'src/assets/img/icons/warning.svg?react'

type TextInputProps = ComponentPropsWithRef<'input'> & {
  error?: string | boolean;
}

const TextInput = ({ error, ...props }: TextInputProps) => {
  const borderClassName = classNames({
    'border-slate-400 peer-hover:border-black peer-focus:border-black': !error,
    'border-red-400 peer-hover:border-red peer-focus:border-red': error
  }, 'w-full border-b')

  return (
    <div>
      <input
        type="text"
        className={`py-2 text-body-s text-black placeholder:text-secondary rounded-sm w-full peer
        focus:outline-none focus:placeholder-shown:ring-2 focus:placeholder-shown:ring-slate-400`}
        {...props}
      />
      <div className={borderClassName}></div>
      {error && (
        <div className='flex gap-2 items-center mt-2 text-red-400'>
          <WarningIcon />
          <Text size='xs' color="red">{error}</Text>
        </div>
      )}
    </div>
  )
}

export default TextInput
