import { cn } from '@/lib/cn'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-16',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px]',
            light
              ? 'bg-white/10 text-gold border border-white/20'
              : 'bg-primary/10 text-primary border border-primary/15',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-heading font-extrabold text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] mb-4 tracking-tighter',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'max-w-xl mx-auto leading-relaxed',
            light ? 'text-white/70' : 'text-ink-muted',
          )}
        >
          {description}
        </p>
      )}
      <div
        className={cn(
          'accent-line mt-5',
          align === 'center' ? 'mx-auto' : 'ml-0',
        )}
      />
    </div>
  )
}
