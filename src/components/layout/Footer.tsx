import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { company } from '@/data/company'
import { Container } from '@/components/ui/Container'
import { categories } from '@/data/categories'
import { NewsletterForm } from './NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-surface-footer text-white pt-16 pb-6 mt-0">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/images/RP_Logo_Small.jpg"
                alt="RP & Associates"
                width={200}
                height={67}
                quality={95}
                className="h-14 w-auto object-contain bg-white rounded-md p-2"
                sizes="200px"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {company.tagline}. Over {company.yearsInBusiness} years
              designing, manufacturing, and distributing premium promotional
              products for major brands.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink
                href={company.social.twitter}
                label="Twitter"
                path="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05A4.28 4.28 0 0 0 11.05 8.4 12.14 12.14 0 0 1 1.64 3.16a4.28 4.28 0 0 0 1.32 5.71 4.27 4.27 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.59 8.59 0 0 1 1 17.54 12.13 12.13 0 0 0 7.55 19.5c7.86 0 12.16-6.51 12.16-12.16 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 22.46 6z"
              />
              <SocialLink
                href={company.social.linkedin}
                label="LinkedIn"
                path="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.91 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.49v6.25zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
              />
              <SocialLink
                href={company.social.instagram}
                label="Instagram"
                path="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13.67.65 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.87 5.87 0 0 0 2.13-1.38 5.87 5.87 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.38-2.13A5.87 5.87 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
              />
            </div>
          </div>

          <div>
            <h4 className="font-heading text-base font-bold mb-5 text-white">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="text-white/60 text-sm hover:text-gold-light transition"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base font-bold mb-5 text-white">
              More Info
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-white/60 text-sm hover:text-gold-light transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogs"
                  className="text-white/60 text-sm hover:text-gold-light transition"
                >
                  Catalogs
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-white/60 text-sm hover:text-gold-light transition"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/industries"
                  className="text-white/60 text-sm hover:text-gold-light transition"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="text-white/60 text-sm hover:text-gold-light transition"
                >
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/60 text-sm hover:text-gold-light transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base font-bold mb-5 text-white">
              Get in Touch
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href={`tel:${company.phoneTel}`}
                  className="flex items-start gap-2.5 text-white/60 text-sm hover:text-gold-light transition"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-start gap-2.5 text-white/60 text-sm hover:text-gold-light transition"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                {company.address.full}
              </li>
            </ul>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Powered by</span>
            <a
              href="https://merktop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-semibold tracking-wider hover:text-gold-light transition-colors inline-flex items-center gap-1 group"
              aria-label="Merktop — opens in new tab"
            >
              MERKTOP
              <span
                aria-hidden
                className="inline-block w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold-light transition"
              />
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}

interface SocialLinkProps {
  href: string
  label: string
  path: string
}

function SocialLink({ href, label, path }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/8 hover:bg-gradient-to-br hover:from-primary hover:to-primary-light flex items-center justify-center text-white/70 hover:text-white transition-all hover:translate-y-[-2px]"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-current"
        aria-hidden
      >
        <path d={path} />
      </svg>
    </a>
  )
}
