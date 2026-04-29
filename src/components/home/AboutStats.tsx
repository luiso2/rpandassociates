'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { company } from '@/data/company'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

interface CounterProps {
  target: number
  suffix?: string
}

function Counter({ target, suffix = '+' }: CounterProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const t = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(target * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

export function AboutStats() {
  return (
    <section id="about" className="py-24 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="left">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-soft-lg">
              <Image
                src="/images/New-Office.JPG"
                alt="RP & Associates Hermosa Beach office"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-gold/15" />
            </div>
          </Reveal>
          <Reveal variant="right">
            <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-primary/10 text-primary border border-primary/15">
              About Us
            </span>
            <h2 className="font-heading font-extrabold text-[clamp(2rem,4vw,2.6rem)] leading-tight mb-5 tracking-tight text-ink">
              Over <span className="text-primary">{company.yearsInBusiness} years</span>
              {' '}designing custom products for the world&apos;s best brands
            </h2>
            <p className="text-ink-muted leading-relaxed mb-4">
              From our headquarters in Hermosa Beach, California, RP & Associates has spent
              over three decades partnering with major beverage brands, hospitality groups,
              sports franchises, and Fortune 500 companies to bring custom promotional
              products to life — at scale.
            </p>
            <p className="text-ink-muted leading-relaxed mb-8">
              Our vertically integrated process — design, manufacturing, warehousing, and
              distribution — means a single accountable partner from sketch to shipment.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard
                value={<Counter target={company.yearsInBusiness} />}
                label="Years Experience"
              />
              <StatCard
                value={<Counter target={company.productsDesigned} />}
                label="Products Designed"
              />
              <StatCard
                value={<Counter target={company.brandsServed} />}
                label="Brands Served"
              />
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-pill bg-gradient-to-br from-primary to-primary-light text-white text-sm font-bold uppercase tracking-wider shadow-primary hover:-translate-y-1 transition-all"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function StatCard({
  value,
  label,
}: {
  value: React.ReactNode
  label: string
}) {
  return (
    <div className="text-center p-5 glass rounded-lg border border-white/60 shadow-soft-sm">
      <div className="font-heading text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-[1.5px] text-ink-muted mt-1.5 font-semibold">
        {label}
      </div>
    </div>
  )
}
