import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CustomizerWorkspace } from '@/components/customize/CustomizerWorkspace'

export const metadata: Metadata = {
  title: 'Customize — Try Your Logo on Any Product',
  description:
    'Upload your logo and see it instantly applied to any RP & Associates product. Real-time preview with 3D-feel rendering. Submit a quote with your design.',
}

export default function CustomizePage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Customize' }]} />

      <section className="py-10 md:py-14 bg-gradient-to-b from-surface-light via-white to-surface-light">
        <Container>
          <div className="text-center mb-8 md:mb-10 max-w-2xl mx-auto">
            <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-gold/15 text-gold-dark border border-gold/30">
              Live Preview
            </span>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 tracking-tight text-ink leading-tight">
              See your <span className="text-primary">logo</span> on any product
            </h1>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed">
              Upload your brand mark once. Switch between products to see how
              your design lands on Moscow Mules, shakers, glacier bags, and
              more — rendered in real time with 3D-feel perspective.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="text-center text-ink-muted py-20">Loading…</div>
            }
          >
            <CustomizerWorkspace />
          </Suspense>
        </Container>
      </section>
    </main>
  )
}
