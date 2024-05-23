import { Root, Portal, Content, Arrow, Trigger } from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import { ComponentProps, ReactNode } from 'react'

const sizeClassNames = {
  s: 'py-1 px-2 w-fit text-body-xxs',
  m: 'py-4 w-[232px] text-body-xs'
}

type ContentProps = ComponentProps<typeof Content>

const Tooltip = ({
  content,
  trigger,
  size = 's',
  keepOpenOnClick,
  ...contentProps
}: {
    content: ReactNode;
    trigger: ReactNode;
    size?: 's' | 'm';
    keepOpenOnClick?: boolean;
} & ContentProps) => {
  const contentClassName = classNames(
    sizeClassNames[size],
    `bg-black rounded select-none text-white pointer-events-none
     data-[state=delayed-open]:animate-fadeIn data-[state=closed]:animate-fadeOut`
  )

  return (
    <Root>
      <Trigger asChild>
          {trigger}
      </Trigger>
      <Portal>
        <Content
            className={contentClassName}
            sideOffset={4}
            onPointerDownOutside={(event: CustomEvent<{ originalEvent: PointerEvent }>) => {
              if (keepOpenOnClick) event.preventDefault()
            }}
            {...contentProps}
        >
            {content}
            <Arrow height={8} width={10} className="fill-black" />
        </Content>
      </Portal>
    </Root>
  )
}

export default Tooltip
