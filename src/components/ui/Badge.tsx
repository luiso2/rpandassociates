import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'gold' | 'red' | 'dark'
  className?: string
}

const variantClass = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  gold: 'bg-gold/15 text-gold-dark border-gold/30',
  red: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  dark: 'bg-ink/90 text-white border-white/10',
}

export function Badge({
  children,
  variant = 'primary',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[1.5px] border',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
