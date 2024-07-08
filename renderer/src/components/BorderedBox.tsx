import classNames from 'classnames'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

type BorderedBoxProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
  isGrouped?: boolean;
}

const BorderedBox = ({
  children,
  isGrouped,
  ...props
}: BorderedBoxProps) => {
  const className = classNames(
    {
      'first:rounded-t-lg last:rounded-b-lg border-t-0 first:border-t': isGrouped,
      'rounded-lg': !isGrouped
    },
    'bg-slate-50 border border-dashed border-slate-400',
    props.className
  )

  return (
    <div {...props} className={className}>
      {children}
    </div>
  )
}

export default BorderedBox
