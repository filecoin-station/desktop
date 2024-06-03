import classNames from 'classnames'
import { ComponentPropsWithRef, forwardRef } from 'react'
import Text from './Text'
import WarningIcon from 'src/assets/img/icons/warning.svg?react'

type TextInputProps = {
  variant: 'primary' | 'secondary';
  error?: string | boolean;
} & ComponentPropsWithRef<'input'>

const variantClassNames = {
  primary: `text-black placeholder:text-secondary focus:outline-none rounded-sm 
  focus:placeholder-shown:ring-2 focus:placeholder-shown:ring-slate-400`,
  secondary: `px-5 text-white placeholder:text-white border bg-black text-center
  focus:ring-0 ring-0 focus:outline-1 rounded-[4px]`
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function ({
  variant,
  error,
  ...props
}, ref) {
  const inputClassName = classNames(
    variantClassNames[variant],
    {
      'border-dashed border-white focus:outline-slate-400': variant === 'secondary' && !error,
      'border-solid border-red-400 focus:outline-red-400': variant === 'secondary' && error
    },
    'py-2 text-body-s w-full peer'
  )

  const borderClassName = classNames({
    'border-slate-400 peer-hover:border-black peer-focus:border-black': !error,
    'border-red-400 peer-hover:border-red peer-focus:border-red': error
  }, 'w-full border-b')

  const errorClassName = classNames({
    'mt-2': variant === 'primary',
    'mt-3': variant === 'secondary'
  }, 'flex gap-2 items-start text-red-400')

  return (
    <div>
      <input
        type="text"
        className={inputClassName}
        ref={ref}
        {...props}
      />
      {variant === 'primary' && (
        <div className={borderClassName}></div>
      )}
      {error && (
        <div className={errorClassName}>
          <WarningIcon className='w-4 h-4 mt-[1px]' />
          <Text size='xs' color="red">{error}</Text>
        </div>
      )}
    </div>
  )
})

TextInput.displayName = 'TextInput'

export default TextInput
