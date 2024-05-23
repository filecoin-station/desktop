import classNames from 'classnames'
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

const DEFAULT_ELEMENT = 'button'

type ButtonOwnProps<C> = {
    variant: 'primary' | 'secondary';
    icon?: ReactNode;
    as?: C;
    children: ReactNode;
}

type ButtonProps<C extends ElementType = typeof DEFAULT_ELEMENT>
    = ButtonOwnProps<C> & ComponentPropsWithoutRef<C>

const variantClassNames = {
  primary: 'bg-primary text-white',
  secondary: 'bg-slate-50 text-primary outline-1 outline-dashed outline-primary'
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
    `flex gap-2 items-center font-mono text-2xs py-2 px-6 rounded-[28px] 
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
