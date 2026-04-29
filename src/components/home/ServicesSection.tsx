import { Pencil, Factory, Truck } from 'lucide-react'
import { services } from '@/data/services'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'

const iconMap = {
  Pencil,
  Factory,
  Truck,
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-28 relative bg-gradient-to-b from-[#e8ecf8] via-[#dde2f4] to-[#e8ecf8]"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 20%, rgba(0,35,204,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(77,111,255,0.04) 0%, transparent 50%)',
        }}
      />
      <Container>
        <div className="relative z-10">
          <SectionTitle
            eyebrow="What We Do"
            title="Three Services, One Partner"
            description="From concept sketches to nationwide delivery — we own the full journey of your custom product."
          />
          <div className="grid md:grid-cols-3 gap-7">
            {services.map((s, i) => {
              const Icon = iconMap[s.iconName as keyof typeof iconMap] ?? Pencil
              return (
                <Reveal key={s.slug} variant="up" delay={i * 100}>
                  <div className="text-center p-14 px-9 glass rounded-xl shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-2.5 transition-all duration-300 ease-spring border border-white/70 h-full">
                    <div className="w-22 h-22 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-primary group-hover:scale-105 transition">
                      <Icon className="w-11 h-11 text-white" strokeWidth={1.6} />
                    </div>
                    <h3 className="font-heading text-xl font-extrabold mb-3 text-ink tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-ink-muted text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
