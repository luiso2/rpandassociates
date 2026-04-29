import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react'
import { company } from '@/data/company'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Over ${company.yearsInBusiness} years designing custom promotional products in Hermosa Beach, California.`,
}

export default function AboutPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'About' }]} />

      <section className="py-14 bg-white">
        <Container>
          <SectionTitle
            eyebrow="About"
            title={`Over ${company.yearsInBusiness} years building brands`}
            description="From our headquarters in Hermosa Beach, California, RP & Associates has spent over three decades partnering with major beverage brands, hospitality groups, sports franchises, and Fortune 500 companies."
          />

          <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-soft-lg">
              <Image
                src="/images/New-Office.JPG"
                alt="RP & Associates Hermosa Beach office"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-gold/10" />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-5 tracking-tight text-ink">
                Vertically integrated. Accountable. Premium.
              </h2>
              <div className="space-y-4 text-ink-muted leading-relaxed">
                <p>
                  RP & Associates was founded in {company.foundedYear} on a
                  simple idea: brands deserve a single accountable partner from
                  sketch to shipment. Today we own every step — design,
                  manufacturing, warehousing, and distribution — under one roof
                  in Hermosa Beach.
                </p>
                <p>
                  Our line of patented products (the Grub Tub, foldable yards,
                  beverage pouches, no-funnel flask) sits alongside thousands of
                  custom barware, drinkware, packaging, and Moscow Mule programs
                  produced for some of the most iconic names in beverage,
                  hospitality, and retail.
                </p>
                <p>
                  Every project — small or massive — is led by a real designer
                  and managed by a real account executive. We pick up the phone.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-16">
            <Stat label="Years Experience" value={`${company.yearsInBusiness}+`} />
            <Stat
              label="Products Designed"
              value={`${company.productsDesigned.toLocaleString()}+`}
            />
            <Stat
              label="Brands Served"
              value={`${company.brandsServed.toLocaleString()}+`}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <ContactBlock
              icon={<MapPin className="w-5 h-5" />}
              title="Headquarters"
              body={company.address.full}
            />
            <ContactBlock
              icon={<Phone className="w-5 h-5" />}
              title="Phone"
              body={company.phone}
              href={`tel:${company.phoneTel}`}
            />
            <ContactBlock
              icon={<Clock className="w-5 h-5" />}
              title="Hours"
              body={`${company.hours.days} · ${company.hours.times}`}
            />
          </div>

          <div className="text-center">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-pill bg-gradient-to-br from-primary to-primary-light text-white text-sm font-bold uppercase tracking-wider shadow-primary hover:-translate-y-1 transition-all"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 glass rounded-lg border border-white/60">
      <div className="font-heading text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-[1.5px] text-ink-muted mt-2 font-semibold">
        {label}
      </div>
    </div>
  )
}

function ContactBlock({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode
  title: string
  body: string
  href?: string
}) {
  const content = (
    <div className="p-5 rounded-xl bg-surface-light border border-black/5 hover:border-primary/30 hover:bg-white transition-all">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-heading text-base font-bold text-ink mb-1">{title}</h4>
      <p className="text-sm text-ink-muted">{body}</p>
    </div>
  )
  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  )
}
