import { HeroCarousel } from '@/components/home/HeroCarousel'
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
      <CtaBanner
        variant="red"
        message="Limited-time pricing on featured stainless steel barware"
        ctaLabel="Request a Quote"
        ctaHref="/quote"
      />
      <CatalogsSection />
      <CtaBanner
        variant="dark"
        message="Need it custom? Our designers are standing by."
        ctaLabel="Talk to a Designer"
        ctaHref="/quote"
      />
      <ServicesSection />
      <FeaturedProducts />
      <IndustriesGrid />
      <PopularBanners />
      <ProcessSteps />
      <AboutStats />
      <QuoteSection />
    </main>
  )
}
