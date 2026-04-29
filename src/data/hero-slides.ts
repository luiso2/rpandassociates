export interface HeroSlide {
  image: string
  alt: string
  eyebrow: string
  title: string
  subtitle: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

export const heroSlides: HeroSlide[] = [
  {
    image: '/images/SlidersHP/3-Piece-Shakers.png',
    alt: '3-Piece Cocktail Shakers',
    eyebrow: 'Premium Barware',
    title: 'Custom Cocktail Shakers Built for Your Brand',
    subtitle:
      'Stainless steel, copper, and custom-printed shakers designed and manufactured in-house for hospitality leaders worldwide.',
    ctaPrimary: { label: 'Request a Quote', href: '/quote' },
    ctaSecondary: { label: 'Browse Barware', href: '/products/barware' },
  },
  {
    image: '/images/SlidersHP/baseball-items-generic-slider.png',
    alt: 'Baseball Items Collection',
    eyebrow: 'Sports & Stadiums',
    title: 'Stadium-Ready Promotional Drinkware',
    subtitle:
      'From Sports Hat Bowls to Party Balls — programs trusted by major league franchises and concessionaires.',
    ctaPrimary: { label: 'Explore Drinkware', href: '/products/drinkware' },
    ctaSecondary: { label: 'Industries We Serve', href: '/industries/sports' },
  },
  {
    image: '/images/SlidersHP/drinkware-generic-logos-slider.png',
    alt: 'Custom Drinkware Logos',
    eyebrow: 'Drinkware Programs',
    title: 'Your Brand, Beautifully Reproduced',
    subtitle:
      'Plastic, glass, aluminum, and stainless steel drinkware decorated with your colors, logos, and finishes.',
    ctaPrimary: { label: 'See Capabilities', href: '/products/drinkware' },
  },
  {
    image: '/images/SlidersHP/Custom-Shaker-Tops2.png',
    alt: 'Custom Shaker Tops',
    eyebrow: 'Bespoke Design',
    title: 'Custom Shaker Tops & Specialty Closures',
    subtitle:
      'In-house mold making and decoration for one-of-a-kind closures, glorifiers, and sealing solutions.',
    ctaPrimary: { label: 'Talk to a Designer', href: '/quote' },
  },
  {
    image: '/images/SlidersHP/foldable-yards-slider-generic-logos.png',
    alt: 'Foldable Yards',
    eyebrow: 'Innovative Packaging',
    title: 'Foldable Yards & Beverage Pouches',
    subtitle:
      'Patented packaging that ships flat and stands tall — reduce freight and shelf footprint without sacrificing impact.',
    ctaPrimary: { label: 'See Bev. Bags', href: '/products/beverage-bags' },
  },
  {
    image: '/images/SlidersHP/Grub-Tubs2.png',
    alt: 'Grub Tubs',
    eyebrow: 'The Grub Tub Line',
    title: 'Snack Tubs Built to Get Noticed',
    subtitle:
      'Acrylic styrene, bamboo, and clear plastic Grub Tubs in oval, round, and squared shapes — fully customizable.',
    ctaPrimary: { label: 'Explore Grub Tubs', href: '/products/grub-tubs' },
  },
]
