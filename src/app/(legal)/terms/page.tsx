import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { company } from '@/data/company'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms governing the use of ${company.domain} and the quote-request flow operated by ${company.name}.`,
}

export default function TermsPage() {
  const lastUpdated = 'April 2026'
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Terms of Use' }]} />

      <section className="py-14 bg-white">
        <Container size="md">
          <header className="mb-10">
            <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-primary/10 text-primary border border-primary/15">
              Legal
            </span>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 text-ink leading-tight">
              Terms of Use
            </h1>
            <p className="text-sm text-ink-muted">Last updated: {lastUpdated}</p>
          </header>

          <article className="prose prose-slate max-w-none text-ink-body leading-relaxed space-y-6">
            <Section title="Agreement">
              <p>
                By accessing {company.domain} (the “Site”) you agree to these Terms of Use. If you do not agree, please do not use the Site. The Site is operated by {company.name}, a U.S. business based in {company.address.city}, {company.address.state}.
              </p>
            </Section>

            <Section title="What we offer">
              <p>
                {company.name} is a business-to-business supplier of custom promotional products. The Site is a catalog and quote-request tool. Submitting a quote does not create a binding purchase order — it&apos;s an invitation for our team to respond with pricing, MOQs, and lead times based on your specifications.
              </p>
            </Section>

            <Section title="Quote requests &amp; orders">
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Pricing depends on quantity, materials, customization, and current freight conditions.</li>
                <li>Orders are confirmed only by a written quote acceptance from {company.name} (PDF or signed proposal).</li>
                <li>Lead times are estimates. We will inform you of any material schedule changes promptly.</li>
                <li>Custom-decorated goods are non-returnable once production has started, unless defective.</li>
              </ul>
            </Section>

            <Section title="Intellectual property">
              <p>
                Site content (text, design, photographs, code) is owned by or licensed to {company.name} and protected by U.S. and international IP laws. You may share links to the Site freely. You may not copy product photography or descriptions wholesale for resale.
              </p>
              <p>
                Logos and artwork you upload to the customizer remain yours. By submitting them you grant {company.name} a non-exclusive license to render them on product previews, store them for the lifetime of your project, and reproduce them on goods you order from us.
              </p>
            </Section>

            <Section title="Acceptable use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Submit quote forms with false or impersonating information.</li>
                <li>Upload artwork you don&apos;t have rights to use.</li>
                <li>Attempt to overload the AI chat assistant, scrape the catalog, or interfere with rate limits.</li>
                <li>Use the Site to host malware or attempt to compromise security controls.</li>
              </ul>
            </Section>

            <Section title="Third-party links">
              <p>
                We link out to{' '}
                <a
                  href="https://issuu.com/rpandassociates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Issuu
                </a>{' '}
                for downloadable catalogs. We&apos;re not responsible for the content or privacy practices of external sites.
              </p>
            </Section>

            <Section title="Disclaimers">
              <p>
                The Site and the AI chat assistant are provided “as is.” Information about products is presented in good faith but may change; the official record of any program is the written quote we send you. Sample colors and dimensions on screen approximate the physical product within typical printing tolerances.
              </p>
            </Section>

            <Section title="Limitation of liability">
              <p>
                To the maximum extent allowed by law, {company.name}&apos;s liability for any claim arising from your use of the Site is limited to the greater of (a) the amount you paid us for products in the prior 12 months, or (b) USD $100. We are not liable for indirect, incidental, or consequential damages.
              </p>
            </Section>

            <Section title="Governing law">
              <p>
                These Terms are governed by the laws of the State of California, USA, without regard to conflict-of-law principles. Disputes will be resolved in the state or federal courts located in Los Angeles County, California.
              </p>
            </Section>

            <Section title="Changes">
              <p>
                We may update these Terms occasionally. The “Last updated” date above reflects the current revision. Continued use of the Site after changes are posted constitutes acceptance.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Legal inquiries:{' '}
                <a
                  href={`mailto:${company.email}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {company.email}
                </a>
                <br />
                {company.address.full}
              </p>
            </Section>
          </article>
        </Container>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-heading text-lg md:text-xl font-bold text-ink mt-8 mb-3 tracking-tight">
        {title}
      </h2>
      <div className="text-[15px] leading-[1.7] space-y-3">{children}</div>
    </div>
  )
}
