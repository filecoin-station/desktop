import classNames from 'classnames'
import { ReactNode } from 'react'

const PageShell = ({
  children,
  hasMaxWidth
}: {
    children: ReactNode;
    hasMaxWidth?: boolean;
}) => {
  const className = classNames({
    'w-[1000px] max-w-full mx-auto': hasMaxWidth,
    'flex-1': !hasMaxWidth
  }, 'px-9 mt-28 flex flex-col')

  return (
    <main className={className}>
        {children}
    </main>
  )
}

export default PageShell
