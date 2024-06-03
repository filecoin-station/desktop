import classNames from 'classnames'
import { type ReactNode, useEffect, useState, useRef, ElementType, ComponentPropsWithoutRef, TransitionEvent } from 'react'

const DEFAULT_ELEMENT = 'div'

type TransitionOwnProps<C> = {
  children: ReactNode;
  on: boolean;
  delayIn?: number;
  unmountOnEnd?: boolean;
  onEnd?: () => void;
  inClass?: string;
  outClass?: string;
  as?: C;
}

type TransitionProps<C extends ElementType = typeof DEFAULT_ELEMENT> =
  TransitionOwnProps<C> & ComponentPropsWithoutRef<C>

const Transition = <C extends ElementType = typeof DEFAULT_ELEMENT>({
  children,
  on,
  delayIn = 0,
  unmountOnEnd = false,
  inClass = 'animate-fadeIn',
  outClass = 'animate-fadeOut',
  onEnd,
  as,
  ...props
}: TransitionProps<C>) => {
  const Component = as || DEFAULT_ELEMENT

  const [shouldRender, setShouldRender] = useState(on)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!on) return

    if (delayIn) {
      timeout.current = setTimeout(() => setShouldRender(true), delayIn)
    } else {
      setShouldRender(true)
    }

    return () => {
      clearTimeout(timeout.current)
    }
  }, [on, delayIn])

  const onAnimationEnd = (event: AnimationEvent) => {
    event.stopPropagation()

    if (!on && unmountOnEnd) {
      onEnd?.()
      setShouldRender(false)
    }
  }

  const onTransitionEnd = (event: TransitionEvent) => {
    event.stopPropagation()

    if (!on && unmountOnEnd) {
      onEnd?.()
      setShouldRender(false)
    }
  }

  return (
    shouldRender && (
      <Component
        {...props}
        className={classNames(
          {
            [outClass]: !on,
            [inClass]: on
          },
          props.className
        )}
        onAnimationEnd={onAnimationEnd}
        onTransitionEnd={onTransitionEnd}
      >
        {children}
      </Component>
    )
  )
}

export default Transition
