import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { company } from '@/data/company'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'
import { QuoteForm } from '@/components/quote/QuoteForm'

export function QuoteSection() {
  return (
    <section
      id="quote"
      className="py-24 relative bg-gradient-to-b from-surface-light to-white"
    >
      <Container>
        <SectionTitle
          eyebrow="Get Started"
          title="Request Your Quote"
          description="Tell us about your project. A specialist will follow up within one business day with options, MOQs, and timelines."
        />
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <Reveal variant="up">
            <QuoteForm source="homepage" />
          </Reveal>
          <Reveal variant="right" delay={100}>
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
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

interface ContactRowProps {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

function ContactRow({ icon, label, value, href }: ContactRowProps) {
  const content = (
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
  if (!href) return content
  return (
    <a href={href} className="block hover:opacity-80 transition">
      {content}
    </a>
  )
}
