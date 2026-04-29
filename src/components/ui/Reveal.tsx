'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type RevealVariant = 'up' | 'left' | 'right' | 'scale'

interface RevealProps {
  children: React.ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

const variantClass: Record<RevealVariant, string> = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any
  return (
    <Component
      ref={ref}
      className={cn(variantClass[variant], visible && 'visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}
