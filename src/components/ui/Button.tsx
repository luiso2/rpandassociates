import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'gold' | 'ghost' | 'ghost-light' | 'red'
type Size = 'sm' | 'md' | 'lg'

interface ButtonBaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-primary to-primary-light text-white shadow-primary hover:translate-y-[-2px] hover:from-primary-light hover:to-primary',
  gold: 'bg-gradient-to-br from-gold to-gold-dark text-white shadow-gold hover:from-gold-light hover:to-gold hover:translate-y-[-2px]',
  ghost:
    'bg-white/10 text-white border border-white/30 backdrop-blur-md hover:bg-white/20 hover:border-white/50 hover:translate-y-[-2px]',
  'ghost-light':
    'bg-white/60 text-ink border border-white/70 backdrop-blur-md hover:bg-white/80 hover:translate-y-[-2px]',
  red: 'bg-white text-accent-red hover:translate-y-[-2px] shadow-soft-md',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-pill transition-all duration-200 ease-spring cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed'

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  { variant = 'primary', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})

interface LinkButtonProps
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}
