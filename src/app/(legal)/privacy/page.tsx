import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { company } from '@/data/company'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy practices for ${company.name} — what we collect from quote requests and chat interactions, how we use it, and how to reach us.`,
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'April 2026'
  return (
    <main>
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <section className="py-14 bg-white">
        <Container size="md">
          <header className="mb-10">
            <span className="inline-block mb-3 px-3 py-1 rounded-pill text-[10px] font-bold uppercase tracking-[2px] bg-primary/10 text-primary border border-primary/15">
              Legal
            </span>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl mb-4 text-ink leading-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-ink-muted">Last updated: {lastUpdated}</p>
          </header>

          <article className="prose prose-slate max-w-none text-ink-body leading-relaxed space-y-6">
            <Section title="Who we are">
              <p>
                {company.name} (“we”, “us”, “our”) operates {company.domain}{' '}
                and provides custom promotional products to business
                customers. Our headquarters is at {company.address.full}.
              </p>
            </Section>

            <Section title="What we collect">
              <p>We collect personal information you provide directly when:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>You submit a quote request (name, company, email, phone, products of interest, optional cart contents).</li>
                <li>You subscribe to our newsletter (email only).</li>
                <li>You converse with our AI chat assistant (the messages you send during the session).</li>
              </ul>
              <p>
                We also collect basic technical information (IP address,
                browser, pages visited) for security, rate-limiting, and
                aggregate analytics.
              </p>
            </Section>

            <Section title="How we use it">
              <ul className="list-disc pl-6 space-y-1.5">
                <li>To respond to your quote and sample requests.</li>
                <li>To send the newsletter you opted into (you can unsubscribe at any time).</li>
                <li>To improve product recommendations and the chat assistant&apos;s responses.</li>
                <li>To prevent abuse (rate-limiting, fraud detection).</li>
              </ul>
            </Section>

            <Section title="Who we share it with">
              <p>We don&apos;t sell your information. We share it only with:</p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong>Resend</strong> — our transactional email provider, to deliver quote confirmations and your newsletter signups.
                </li>
                <li>
                  <strong>OpenAI</strong> — to power the AI chat assistant. Messages are processed in real time and not retained for training in our deployment.
                </li>
                <li>
                  <strong>Railway &amp; Cloudflare</strong> — our hosting and CDN providers.
                </li>
                <li>
                  Law enforcement when required by valid legal process.
                </li>
              </ul>
            </Section>

            <Section title="Cookies & tracking">
              <p>
                We use first-party cookies and{' '}
                <code className="px-1 py-0.5 rounded bg-surface-section text-[0.85em]">
                  localStorage
                </code>{' '}
                only for: (a) the Quote Cart you build during a session, (b) preference state (filters, search history). We do not run third-party advertising trackers.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                Depending on where you live (CCPA in California, GDPR in the EU/UK, similar laws elsewhere), you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>Access the personal data we hold about you.</li>
                <li>Ask us to correct or delete it.</li>
                <li>Opt out of marketing communications.</li>
                <li>Lodge a complaint with your local data protection authority.</li>
              </ul>
              <p>
                To exercise these rights, email{' '}
                <a
                  href={`mailto:${company.email}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {company.email}
                </a>
                . We will respond within 30 days.
              </p>
            </Section>

            <Section title="Security">
              <p>
                We protect your information with HTTPS-only delivery, security headers (CSP, HSTS, X-Frame-Options), in-memory rate limiting, and Zod-validated input on every API endpoint. No system is perfect — please use a unique email address and avoid reusing passwords across services.
              </p>
            </Section>

            <Section title="Children">
              <p>
                {company.name} sells to business customers. The site is not directed to children under 16, and we do not knowingly collect their information.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p>
                We&apos;ll post any updates here and update the “Last updated” date above. Material changes will be announced via the newsletter if you&apos;re subscribed.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Questions, concerns, or data requests:{' '}
                <a
                  href={`mailto:${company.email}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {company.email}
                </a>
                {' · '}
                <a
                  href={`tel:${company.phoneTel}`}
                  className="text-primary font-semibold hover:underline"
                >
                  {company.phone}
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
