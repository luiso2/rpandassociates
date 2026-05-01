import { HeroCarousel } from '@/components/home/HeroCarousel'
import { SportsTicker } from '@/components/home/SportsTicker'
import { CtaBanner } from '@/components/home/CtaBanner'
import { CatalogsSection } from '@/components/home/CatalogsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { IndustriesGrid } from '@/components/home/IndustriesGrid'
import { PopularBanners } from '@/components/home/PopularBanners'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { AboutStats } from '@/components/home/AboutStats'
import { QuoteSection } from '@/components/home/QuoteSection'

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <SportsTicker />
      <CtaBanner
        variant="red"
        message="Spring promotional cycle is open — lock in stadium-ready stock today"
        ctaLabel="Talk to a Specialist"
        ctaHref="/quote"
      />
      <FeaturedProducts />
      <IndustriesGrid />
      <CatalogsSection />
      <CtaBanner
        variant="dark"
        message="Designers in-house · 35 years vertical integration · One accountable partner"
        ctaLabel="Start Your Project"
        ctaHref="/quote"
      />
      <ServicesSection />
      <PopularBanners />
      <ProcessSteps />
      <AboutStats />
      <QuoteSection />
    </main>
  )
}
