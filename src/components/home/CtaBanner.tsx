import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

interface CtaBannerProps {
  message: string
  ctaLabel: string
  ctaHref: string
  variant?: 'red' | 'dark'
}

export function CtaBanner({
  message,
  ctaLabel,
  ctaHref,
  variant = 'red',
}: CtaBannerProps) {
  const variantClasses = {
    red: 'bg-gradient-to-br from-accent-red via-accent-red-light to-accent-red-dark',
    dark: 'bg-gradient-to-br from-ink-body via-ink to-ink-body',
  }
  const ctaTextClass = variant === 'red' ? 'text-accent-red' : 'text-ink'
  return (
    <section
      className={cn(
        'relative py-12 text-center overflow-hidden',
        variantClasses[variant],
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
      <Container>
        <div className="relative z-10">
          <p className="text-white text-xl md:text-2xl font-bold mb-5 drop-shadow-md tracking-tight">
            {message}
          </p>
          <Link
            href={ctaHref}
            className={cn(
              'inline-flex items-center gap-2 px-9 py-3.5 rounded-pill bg-white font-bold text-sm uppercase tracking-[0.3px] shadow-soft-md hover:-translate-y-1 transition-all',
              ctaTextClass,
            )}
          >
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
