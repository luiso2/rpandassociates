import type { Industry } from '@/types/industry'

export const industries: Industry[] = [
  {
    slug: 'hospitality',
    name: 'Hospitality',
    tagline: 'Resorts, hotels, and cruise lines',
    description:
      'Custom in-room amenities, branded barware, and welcome packaging for premium guest experiences.',
    heroImage: '/images/Glass-Mason-Jar-Banner-Home-Page.jpg',
    iconName: 'BedDouble',
    featuredCategorySlugs: ['drinkware', 'barware', 'vaps'],
  },
  {
    slug: 'beverage',
    name: 'Beverage Brands',
    tagline: 'Spirits, beer, wine, and NA',
    description:
      'On-premise activation kits, branded shakers and glorifiers, custom point-of-sale displays for beverage giants.',
    heroImage: '/images/Custom-Bottle-Glorifiers_banner.png',
    iconName: 'Wine',
    featuredCategorySlugs: ['barware', 'glacier-bags', 'mule-mugs'],
  },
  {
    slug: 'retail',
    name: 'Retail',
    tagline: 'Big-box, club, and specialty',
    description:
      'Retail-ready packaging programs, in-store display solutions, and themed seasonal SKUs.',
    heroImage: '/images/Vaps-custom-packaging-banner.jpg',
    iconName: 'Store',
    featuredCategorySlugs: ['vaps', 'beverage-bags'],
  },
  {
    slug: 'sports',
    name: 'Sports & Stadiums',
    tagline: 'MLB, NFL, NHL, NBA, MLS',
    description:
      'Concession-ready drinkware, Sports Hat Bowls, Party Balls, and stadium-themed promotional programs.',
    heroImage: '/images/sportsbowls-2.jpg',
    iconName: 'Trophy',
    featuredCategorySlugs: ['drinkware', 'grub-tubs'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    tagline: 'Hospitals, clinics, pharma',
    description:
      'Patient amenity kits, branded healthcare promotional items, and HIPAA-aware custom packaging.',
    heroImage: '/images/Vap-2019-2.png',
    iconName: 'Stethoscope',
    featuredCategorySlugs: ['vaps', 'drinkware'],
  },
  {
    slug: 'corporate',
    name: 'Corporate Gifting',
    tagline: 'Fortune 500 swag programs',
    description:
      'Premium executive gifts, branded barware sets, and curated corporate gifting solutions.',
    heroImage: '/images/2018-classic-moscow-mule-mug-banner.jpg',
    iconName: 'Briefcase',
    featuredCategorySlugs: ['mule-mugs', 'barware', 'drinkware'],
  },
  {
    slug: 'events',
    name: 'Events & Festivals',
    tagline: 'Weddings, concerts, festivals',
    description:
      'Branded drinkware, foldable yards, and themed party programs that scale to thousands of attendees.',
    heroImage: '/images/Banner-Party-Orb.jpg',
    iconName: 'PartyPopper',
    featuredCategorySlugs: ['drinkware', 'beverage-bags', 'mule-mugs'],
  },
  {
    slug: 'restaurants',
    name: 'Restaurants',
    tagline: 'Chains and independents',
    description:
      'Themed glassware, takeaway packaging, branded condiment caddies, and POS-ready signature items.',
    heroImage: '/images/banner-cup-tin-can.jpg',
    iconName: 'UtensilsCrossed',
    featuredCategorySlugs: ['drinkware', 'barware', 'vaps'],
  },
]

export const industryBySlug = Object.fromEntries(
  industries.map((i) => [i.slug, i]),
) as Record<string, Industry>
