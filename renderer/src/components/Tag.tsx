import classNames from 'classnames'
import { ReactNode } from 'react'

type TagProps = {
    children: ReactNode;
    type: 'primary' | 'secondary' | 'dashed';
}

const typeClassName = {
  primary: 'bg-primary text-white',
  secondary: 'bg-slate-800 text-white',
  dashed: 'bg-white border border-dashed border-primary text-primary'
}

const Tag = ({
  children,
  type
}: TagProps) => {
  const className = classNames(
    typeClassName[type],
    'py-1 px-2 w-fit text-center rounded-[36px] text-mono-3xs font-mono'
  )

  return (
    <div className={className}>
        {children}
    </div>
  )
}

export default Tag
