import { ComponentPropsWithRef } from 'react'

type TextInputProps = ComponentPropsWithRef<'input'>

const TextInput = ({ ...props }: TextInputProps) => {
  return (
    <div>
        <input
            type="text"
            className={`py-2 text-body-s text-black placeholder:text-secondary rounded-sm w-full peer
                        focus:outline-none focus:placeholder-shown:ring-2 focus:placeholder-shown:ring-slate-400`}
            {...props}
        />
        <div className='w-full border-b border-slate-400 peer-hover:border-black peer-focus:border-black'></div>
    </div>
  )
}

export default TextInput
