import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { company } from '@/data/company'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { QuoteForm } from '@/components/quote/QuoteForm'

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    'Tell us about your custom promotional product project. A specialist will follow up within one business day.',
}

export default function QuotePage({
  searchParams,
}: {
  searchParams: { products?: string; from?: string }
}) {
  const defaultProducts = searchParams.products?.toString() ?? ''
  const fromCart = searchParams.from === 'cart'

  return (
    <main>
      <Breadcrumbs items={[{ label: 'Request a Quote' }]} />

      <section className="py-14 bg-gradient-to-b from-surface-light via-white to-surface-light">
        <Container>
          <div className="text-center mb-10">
            <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-primary/10 text-primary border border-primary/15">
              Get Started
            </span>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 tracking-tight text-ink">
              Request Your Quote
            </h1>
            <p className="text-ink-muted text-base max-w-xl mx-auto leading-relaxed">
              Tell us about your project — products, quantities, customization,
              timeline. A specialist follows up within one business day.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start max-w-5xl mx-auto">
            <QuoteForm
              source={fromCart ? 'cart-drawer' : 'quote-page'}
              defaultProducts={defaultProducts}
              includeCart={fromCart}
            />

            <div className="glass rounded-xl p-7 shadow-soft-md border border-white/70 space-y-5">
              <h3 className="font-heading text-lg font-bold text-ink mb-2">
                Talk to a Specialist
              </h3>
              <ContactRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={company.phone}
                href={`tel:${company.phoneTel}`}
              />
              <ContactRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={company.email}
                href={`mailto:${company.email}`}
              />
              <ContactRow
                icon={<MapPin className="w-4 h-4" />}
                label="Address"
                value={company.address.full}
              />
              <ContactRow
                icon={<Clock className="w-4 h-4" />}
                label="Hours"
                value={`${company.hours.days} · ${company.hours.times}`}
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-ink-light">
          {label}
        </div>
        <div className="text-sm font-medium text-ink-body leading-snug">
          {value}
        </div>
      </div>
    </div>
  )
  if (!href) return inner
  return (
    <a href={href} className="block hover:opacity-80 transition">
      {inner}
    </a>
  )
}
