import classNames from 'classnames'
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

const DEFAULT_ELEMENT = 'button'

type ButtonOwnProps<C> = {
  variant: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  as?: C;
  children: ReactNode;
}

type ButtonProps<C extends ElementType = typeof DEFAULT_ELEMENT>
    = ButtonOwnProps<C> & ComponentPropsWithoutRef<C>

const variantClassNames = {
  primary: 'py-2 px-6 bg-primary text-white disabled:bg-blue-300',
  secondary: 'py-2 px-6 bg-slate-50 text-primary outline-1 outline-dashed outline-primary disabled:text-blue-300',
  tertiary: 'py-1 px-1 bg-none text-white'
}

const Button = <C extends ElementType = typeof DEFAULT_ELEMENT>({
  variant,
  as,
  icon,
  children,
  ...props
}: ButtonProps<C>) => {
  const Component = as || DEFAULT_ELEMENT

  const className = classNames(
    `flex gap-2 items-center font-mono text-2xs rounded-[28px] 
     focus:ring ring-slate-400 focus:outline-0`,
    variantClassNames[variant],
    props.className
  )

  return (
    <Component {...props} className={className}>
      {icon}
      {children}
    </Component>
  )
}

export default Button
