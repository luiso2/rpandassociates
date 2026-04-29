import { cn } from '@/lib/cn'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'strong'
}

const variantClass = {
  light: 'glass',
  dark: 'glass-dark',
  strong: 'glass-strong',
}

export function GlassCard({
  variant = 'light',
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variantClass[variant],
        'rounded-xl shadow-soft-md',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
