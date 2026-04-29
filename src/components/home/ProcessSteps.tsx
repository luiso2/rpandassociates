import { PencilRuler, Cog, PackageCheck } from 'lucide-react'
import { processSteps } from '@/data/process-steps'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Reveal } from '@/components/ui/Reveal'

const iconMap = {
  PencilRuler,
  Cog,
  PackageCheck,
}

export function ProcessSteps() {
  return (
    <section id="process" className="py-24 bg-ink text-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(0,41,204,0.18) 0%, transparent 60%), radial-gradient(ellipse at 75% 50%, rgba(201,168,76,0.10) 0%, transparent 60%)',
        }}
      />
      <Container>
        <div className="relative z-10">
          <SectionTitle
            light
            eyebrow="Our Process"
            title="From Concept to Doorstep"
            description="Three phases, one accountable partner, total transparency at every step."
          />
          <div className="relative grid md:grid-cols-3 gap-8">
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"
            />
            {processSteps.map((s, i) => {
              const Icon = iconMap[s.iconName as keyof typeof iconMap] ?? Cog
              return (
                <Reveal key={s.step} variant="up" delay={i * 120}>
                  <div className="text-center relative">
                    <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center border-2 border-gold/40 shadow-primary relative">
                      <Icon className="w-10 h-10 text-white" strokeWidth={1.6} />
                      <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gold text-ink font-heading font-extrabold text-base flex items-center justify-center shadow-gold">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3 text-white tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-white/65 text-sm leading-relaxed max-w-xs mx-auto">
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
