import { Root, Portal, Content, Arrow, Trigger } from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import { ReactNode } from 'react'

const sizeClassNames = {
  s: 'py-1 px-2 w-fit text-body-xxs',
  m: 'py-4 w-[232px] text-body-xs'
}

const Tooltip = ({
  content,
  trigger,
  size = 's',
  side,
  keepOpenOnClick
}: {
    content: ReactNode;
    trigger: ReactNode;
    size?: 's' | 'm';
    side?: 'top' | 'right' | 'bottom' | 'left';
    keepOpenOnClick?: boolean;
}) => {
  const contentClassName = classNames(
    sizeClassNames[size],
    'bg-black rounded select-none text-white'
  )

  return (
    <Root>
        <Trigger asChild>
            {trigger}
        </Trigger>
        <Portal>
            <Content
                className={contentClassName}
                side={side}
                sideOffset={4}
                onPointerDownOutside={(event: CustomEvent<{ originalEvent: PointerEvent }>) => {
                  if (keepOpenOnClick) event.preventDefault()
                }}
            >
                {content}
                <Arrow className="fill-black" />
            </Content>
        </Portal>
    </Root>
  )
}

export default Tooltip
