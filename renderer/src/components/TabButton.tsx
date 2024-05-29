import { ComponentPropsWithoutRef, ReactNode } from 'react'
import Text from './Text'
import classNames from 'classnames'

const TabButton = ({
  children,
  selected,
  ...props
}: {
    children: ReactNode;
    selected?: boolean;
} & ComponentPropsWithoutRef<'button'>
) => {
  const className = classNames(
    'p-1 min-w-[30px] hover:bg-blue-50 hover:outline-none focus-visible:outline-slate-400',
    {
      'bg-blue-50': selected
    }
  )

  return (
    <button {...props} className={className}>
      <Text font='mono' size='3xs'>
        {children}
      </Text>
    </button>
  )
}

const TabButtonGroup = ({ children }: {children: ReactNode}) => {
  return (
    <div className='flex gap-2 p-1 rounded border border-slate-400 border-dashed bg-white'>
      {children}
    </div>
  )
}

export { TabButton, TabButtonGroup }
