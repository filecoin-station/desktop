import { Root, Item, ToggleGroupSingleProps, ToggleGroupItemProps } from '@radix-ui/react-toggle-group'
import { ReactNode } from 'react'
import Text from './Text'

type ToggleGroupButtonProps = {
  children: ReactNode;
  value: string;
} & ToggleGroupItemProps

const ToggleGroupButton = ({
  children,
  value,
  ...props
}: ToggleGroupButtonProps
) => {
  return (
    <Item
      className={`p-1 min-w-[30px] data-[state=on]:bg-blue-50
      hover:bg-blue-50 hover:outline-none focus-visible:outline-slate-400`}
      value={value}
      {...props}
    >
      <Text font='mono' size='3xs'>{children}</Text>
    </Item>
  )
}

type ToggleGroupProps = {children: ReactNode} & Omit<ToggleGroupSingleProps, 'type'>

const ToggleGroup = ({
  children,
  ...props
}: ToggleGroupProps) => {
  return (
    <Root
      className='flex gap-2 p-1 rounded border border-slate-400 border-dashed bg-white'
      type='single'
      {...props}
    >
      {children}
    </Root>
  )
}

export { ToggleGroupButton, ToggleGroup }
