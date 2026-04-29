/**
 * Extended catalog imported from rpacatalog.com.
 *
 * These entries pair each catalog item with our taxonomy
 * (categorySlug + subcategorySlugs) and reasonable spec defaults so
 * that the FilterSidebar facets and product detail spec table populate
 * cleanly. Image URLs go through /api/img at runtime to bypass the
 * upstream CORS issue on the customizer canvas.
 *
 * The `defineProduct()` factory keeps each entry concise — it fills in
 * sensible defaults (customizable: true, featured: false, derived SEO
 * copy) so the body of each product is just the catalog-specific bits.
 */
import type { Product, ProductImage } from '@/types/product'
import type { CategorySlug } from '@/types/category'
import type { IndustrySlug } from '@/types/industry'

const CDN = 'https://www.rpacatalog.com/media/catalog/product/cache/e11a83343d9f0597480ee66c9eea9fbe'

/** Build the full catalog URL from the relative path segment. */
const cdn = (rel: string): string => `${CDN}/${rel}`

interface ProductDef {
  slug: string
  name: string
  shortName?: string
  description: string
  categorySlug: CategorySlug
  subcategorySlugs: string[]
  industries: IndustrySlug[]
  /** Accepts either an `image: { src, alt }` array or a single rel CDN path */
  image: string
  /** Additional images for the gallery (catalog rel paths) */
  altImages?: string[]
  materials: Product['materials']
  minOrderQuantity?: number
  tags?: string[]
  featured?: boolean
  popular?: boolean
  specs?: Product['specs']
  variants?: Product['variants']
  logoZone?: Product['logoZone']
}

function defineProduct(p: ProductDef): Product {
  const img: ProductImage = {
    src: cdn(p.image),
    alt: p.name,
    width: 800,
    height: 800,
  }
  const additional: ProductImage[] = (p.altImages ?? []).map((rel) => ({
    src: cdn(rel),
    alt: p.name,
    width: 800,
    height: 800,
  }))
  return {
    slug: p.slug,
    name: p.name,
    shortName: p.shortName,
    description: p.description,
    categorySlug: p.categorySlug,
    subcategorySlugs: p.subcategorySlugs,
    industries: p.industries,
    images: [img, ...additional],
    materials: p.materials,
    minOrderQuantity: p.minOrderQuantity ?? 250,
    customizable: true,
    tags: p.tags ?? [],
    featured: p.featured ?? false,
    popular: p.popular ?? false,
    specs: p.specs,
    variants: p.variants,
    logoZone: p.logoZone,
    seo: {
      title: `${p.name} — Custom Branded`,
      description: `${p.description.split('.')[0]}. Custom branding by RP & Associates.`,
    },
  }
}

/**
 * Specs presets — capacity, dimensions, lead times etc. for common
 * product archetypes. Avoids restating identical fields per entry.
 */
const SPECS = {
  classicMuleMug: {
    capacityOz: 16,
    capacityMl: 473,
    dimensions: { diameterMm: 90, heightMm: 95 },
    weightG: 280,
    leadTimeDays: { min: 28, max: 42 },
    customizationOptions: ['laser-engraving', 'pad-print'],
    origin: 'Imported',
  } satisfies Product['specs'],
  giantMuleMug: {
    capacityOz: 32,
    capacityMl: 946,
    dimensions: { diameterMm: 120, heightMm: 130 },
    weightG: 540,
    leadTimeDays: { min: 35, max: 49 },
    customizationOptions: ['laser-engraving', 'pad-print'],
    origin: 'Imported',
  } satisfies Product['specs'],
  shaker3Piece: {
    capacityOz: 24,
    capacityMl: 700,
    dimensions: { diameterMm: 80, heightMm: 230 },
    weightG: 380,
    leadTimeDays: { min: 28, max: 42 },
    customizationOptions: ['laser-engraving', 'pad-print', 'silkscreen'],
    origin: 'Imported',
  } satisfies Product['specs'],
  partyCup: {
    capacityOz: 16,
    capacityMl: 473,
    dimensions: { diameterMm: 95, heightMm: 130 },
    weightG: 25,
    leadTimeDays: { min: 21, max: 35 },
    customizationOptions: ['pad-print', 'sticker'],
    origin: 'Imported',
  } satisfies Product['specs'],
  shotGlass: {
    capacityOz: 1.5,
    capacityMl: 44,
    dimensions: { diameterMm: 50, heightMm: 70 },
    weightG: 60,
    leadTimeDays: { min: 21, max: 35 },
    customizationOptions: ['pad-print', 'silkscreen', 'laser-engraving'],
    origin: 'Imported',
  } satisfies Product['specs'],
  glacierBag: {
    dimensions: { widthMm: 300, depthMm: 80, heightMm: 320 },
    weightG: 70,
    leadTimeDays: { min: 35, max: 56 },
    customizationOptions: ['screen-print', 'wrap'],
    origin: 'Imported',
  } satisfies Product['specs'],
  beveragePouch: {
    capacityOz: 16,
    capacityMl: 473,
    dimensions: { widthMm: 130, heightMm: 230 },
    weightG: 18,
    leadTimeDays: { min: 28, max: 42 },
    customizationOptions: ['pad-print', 'screen-print'],
    origin: 'Imported',
  } satisfies Product['specs'],
}

const COPPER_MULE_LOGO_ZONE: Product['logoZone'] = {
  centerX: 0.5,
  centerY: 0.55,
  maxWidth: 0.32,
  maxHeight: 0.16,
  surface: 'cylinder',
  curve: 0.2,
}

export const catalogProducts: Product[] = [
  // ===== MULE MUGS — full premium line =====
  defineProduct({
    slug: 'hammered-moscow-mule',
    name: 'Hammered Moscow Mule Mug',
    description:
      'Iconic hand-hammered copper mug with a textured exterior that catches light beautifully. The bartender favorite.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['hammered', 'pure-copper'],
    industries: ['hospitality', 'beverage', 'restaurants'],
    image: 'h/a/hammered_moscow_mule_mugs_wix.png',
    materials: ['copper'],
    minOrderQuantity: 100,
    tags: ['premium', 'best-seller'],
    featured: true,
    popular: true,
    specs: SPECS.classicMuleMug,
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'giant-moscow-mule',
    name: 'Giant Moscow Mule Mug',
    description:
      'Oversized 32 oz Moscow Mule mug for shareable cocktails and stadium-scale activations.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['giant-shareable'],
    industries: ['hospitality', 'events', 'sports'],
    image: 'g/i/giant_moscow_mule_mugs_wix.png',
    materials: ['copper'],
    minOrderQuantity: 50,
    tags: ['oversized', 'shareable'],
    featured: true,
    specs: SPECS.giantMuleMug,
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.36, maxHeight: 0.18, surface: 'cylinder', curve: 0.22 },
  }),
  defineProduct({
    slug: 'stanley-riveted-mule',
    name: 'Stanley Riveted Moscow Mule Mug',
    description:
      'Industrial riveted construction with brass-finish rivets. Heritage cocktail bar aesthetic.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['riveted', 'pure-copper'],
    industries: ['hospitality', 'beverage'],
    image: 's/t/stanley_riveted_mule_mugs.jpg',
    materials: ['copper', 'stainless-steel'],
    minOrderQuantity: 100,
    tags: ['industrial', 'premium'],
    specs: SPECS.classicMuleMug,
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'hammered-highball-tumbler',
    name: 'Hammered Copper Highball Tumbler',
    description:
      'Tall hammered copper tumbler perfect for cocktails on the rocks and gin & tonic service.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['hammered-highball', 'pure-copper'],
    industries: ['hospitality', 'beverage'],
    image: 'h/a/hammered_copper_tumbler.jpg',
    materials: ['copper'],
    minOrderQuantity: 100,
    tags: ['highball', 'premium'],
    specs: { ...SPECS.classicMuleMug, capacityOz: 12, capacityMl: 355 },
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'colorful-moscow-mule',
    name: 'Colorful Moscow Mule Mug',
    description:
      'Vibrant colored Moscow Mule mugs in red, blue, green, and gold. Perfect for themed venues and events.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['colorful'],
    industries: ['hospitality', 'events', 'restaurants'],
    image: 'c/o/colorfull_mule_mugs.jpg',
    materials: ['copper'],
    minOrderQuantity: 100,
    tags: ['vibrant', 'themed'],
    popular: true,
    specs: SPECS.classicMuleMug,
    variants: [
      { id: 'red', label: 'Red', swatchColor: '#c92335', image: { src: cdn('c/o/colorfull_mule_mugs.jpg'), alt: 'Red Moscow Mule', width: 800, height: 800 } },
      { id: 'blue', label: 'Blue', swatchColor: '#1e40af', image: { src: cdn('c/l/classic_moscow_mule_mugs_wix_1_.png'), alt: 'Blue Moscow Mule', width: 800, height: 800 } },
    ],
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'classic-dutch-mule',
    name: 'Classic Dutch Moscow Mule Mug',
    description:
      'Old-world Dutch interpretation of the classic Mule mug — softer profile, warmer copper tone.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['classic-dutch', 'pure-copper'],
    industries: ['hospitality', 'beverage'],
    image: 'c/l/classic_dutch_mule_mugs.jpg',
    materials: ['copper'],
    minOrderQuantity: 100,
    tags: ['heritage', 'dutch'],
    specs: SPECS.classicMuleMug,
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'russian-silver-mule',
    name: 'Russian Silver Moscow Mule Mug',
    description:
      'Polished silver finish with traditional Russian-style construction.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['russian'],
    industries: ['hospitality', 'beverage', 'corporate'],
    image: 'r/u/russian_silver_moscow_mule_mugs_wix.png',
    materials: ['stainless-steel'],
    minOrderQuantity: 100,
    tags: ['silver', 'traditional'],
    specs: SPECS.classicMuleMug,
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'acrylic-classic-mule',
    name: 'Acrylic Classic Moscow Mule Mug',
    description:
      'Lightweight, shatter-resistant acrylic Moscow Mule mug — ideal for outdoor and pool venues.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['acrylic-classic'],
    industries: ['hospitality', 'events', 'sports'],
    image: 'a/c/acrylic_classic_moscow_mule_mugs_wix.png',
    materials: ['acrylic'],
    minOrderQuantity: 250,
    tags: ['outdoor', 'shatter-resistant'],
    specs: { ...SPECS.classicMuleMug, weightG: 90, customizationOptions: ['pad-print', 'sticker'] },
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'floating-classic-mule',
    name: 'Floating Classic Moscow Mule',
    description:
      'Buoyant Mule mug that floats — a hit at pool parties and resort poolside service.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['floating-artisan'],
    industries: ['hospitality', 'events'],
    image: 'f/l/floating_classic_mule_mugs_2.jpg',
    materials: ['acrylic', 'plastic'],
    minOrderQuantity: 250,
    tags: ['floating', 'pool', 'novelty'],
    specs: SPECS.classicMuleMug,
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),
  defineProduct({
    slug: 'mini-acrylic-mule',
    name: 'Mini Acrylic Moscow Mule',
    description:
      'Mini-sized acrylic Mule mug for tasting flights, sample programs, and cocktail receptions.',
    categorySlug: 'mule-mugs',
    subcategorySlugs: ['mini-acrylic'],
    industries: ['hospitality', 'beverage', 'events'],
    image: 'm/i/mini_artisan_mule_mugs.jpg',
    materials: ['acrylic'],
    minOrderQuantity: 500,
    tags: ['mini', 'tasting'],
    specs: { ...SPECS.classicMuleMug, capacityOz: 4, capacityMl: 118, weightG: 45 },
    logoZone: COPPER_MULE_LOGO_ZONE,
  }),

  // ===== BARWARE — shakers, helmets, novelty =====
  defineProduct({
    slug: '4-in-1-shaker',
    name: '4-in-1 Shaker',
    description:
      'All-in-one cocktail shaker with built-in jigger, strainer, and muddler. Hospitality favorite.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers', 'squeeze-jiggers'],
    industries: ['hospitality', 'beverage', 'restaurants'],
    image: '4/_/4_in_1_shaker_.jpg',
    materials: ['stainless-steel'],
    minOrderQuantity: 250,
    tags: ['multi-function', 'best-seller'],
    popular: true,
    specs: SPECS.shaker3Piece,
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.3, maxHeight: 0.18, surface: 'cylinder', curve: 0.18 },
  }),
  defineProduct({
    slug: 'mason-jar-shaker',
    name: '32oz Mason Jar Shaker',
    description:
      'Mason jar form factor cocktail shaker — country-meets-craft cocktail aesthetic.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers'],
    industries: ['hospitality', 'restaurants', 'events'],
    image: 'g/l/glass_shaker.jpg',
    materials: ['glass'],
    minOrderQuantity: 250,
    tags: ['mason-jar', 'rustic'],
    specs: { ...SPECS.shaker3Piece, capacityOz: 32, capacityMl: 946 },
  }),
  defineProduct({
    slug: 'custom-bottle-replica-shaker',
    name: 'Custom Bottle-Replica Shaker',
    description:
      'Stainless steel cocktail shaker shaped like your branded bottle. Premium beverage activation tool.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers', 'custom-stir-rods'],
    industries: ['beverage', 'hospitality'],
    image: 's/o/sobieski_bottle_replica_shaker_3.jpg',
    materials: ['stainless-steel'],
    minOrderQuantity: 100,
    tags: ['premium', 'bottle-replica', 'custom-shape'],
    featured: true,
    specs: SPECS.shaker3Piece,
  }),
  defineProduct({
    slug: 'drum-shaker',
    name: 'The Drum Shaker',
    description:
      'Drum-shaped cocktail shaker — eye-catching and great for beer brand activations.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers'],
    industries: ['beverage', 'events'],
    image: 'd/r/drum_shaker_3.jpg',
    materials: ['stainless-steel'],
    minOrderQuantity: 250,
    tags: ['themed', 'novelty'],
    specs: SPECS.shaker3Piece,
  }),
  defineProduct({
    slug: 'goalie-mask-shaker',
    name: 'The Goalie Mask Shaker',
    description:
      'Hockey-themed shaker shaped like a goalie mask. Stadium concession standout.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers'],
    industries: ['sports', 'events'],
    image: 'h/o/hockey_helmet_shaker_2.jpg',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['sports', 'hockey'],
    specs: SPECS.shaker3Piece,
  }),
  defineProduct({
    slug: 'football-helmet-shaker',
    name: 'Football Helmet Shaker',
    description:
      'Mini football helmet shaker — tailgate must-have. Customizable per team colors.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers'],
    industries: ['sports', 'events'],
    image: 'f/o/football_helmet_shaker_2.jpg',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['sports', 'football', 'tailgate'],
    popular: true,
    specs: SPECS.shaker3Piece,
  }),
  defineProduct({
    slug: 'baseball-hat-shaker',
    name: 'Baseball Hat Shaker',
    description:
      'Cocktail shaker shaped like a baseball cap — stadium concession favorite.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers'],
    industries: ['sports', 'events'],
    image: 'h/a/hat_shaker_2.jpg',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['sports', 'baseball'],
    specs: SPECS.shaker3Piece,
  }),
  defineProduct({
    slug: 'maraca-shakers',
    name: 'Maraca Cocktail Shakers',
    description:
      'Tropical maraca-shaped cocktail shakers for tiki bars and Latin-themed events.',
    categorySlug: 'barware',
    subcategorySlugs: ['maraca-shakers', 'shakers'],
    industries: ['hospitality', 'restaurants', 'events'],
    image: 'm/a/maraca_shaker.jpg',
    materials: ['plastic', 'stainless-steel'],
    minOrderQuantity: 250,
    tags: ['themed', 'tiki', 'tropical'],
    specs: SPECS.shaker3Piece,
  }),
  defineProduct({
    slug: 'copper-boston-shaker',
    name: 'Copper Boston Shaker',
    description:
      'Two-piece Boston shaker with copper-plated finish. Premium craft cocktail tool.',
    categorySlug: 'barware',
    subcategorySlugs: ['shakers'],
    industries: ['hospitality', 'beverage'],
    image: 'c/o/copper_shaker_2.jpg',
    materials: ['copper', 'stainless-steel'],
    minOrderQuantity: 250,
    tags: ['premium', 'boston'],
    specs: SPECS.shaker3Piece,
  }),

  // ===== DRINKWARE — sports, glassware, themed =====
  defineProduct({
    slug: 'baseball-pint-glass',
    name: 'Baseball Pint Glass',
    description:
      'Classic 16 oz pint glass with baseball-themed graphics. Stadium and sports bar staple.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['glassware'],
    industries: ['sports', 'restaurants'],
    image: 'b/a/baseball_pint_glass.jpg',
    materials: ['glass'],
    minOrderQuantity: 250,
    tags: ['sports', 'baseball', 'glassware'],
    specs: { ...SPECS.partyCup, capacityOz: 16 },
  }),
  defineProduct({
    slug: 'baseball-bat-cup',
    name: 'Baseball Bat Cup',
    description:
      'Tall plastic cup shaped like a baseball bat — concession favorite for stadiums.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['plastic-drinkware'],
    industries: ['sports', 'events'],
    image: 'b/a/bat_cup_1_.jpg',
    materials: ['plastic'],
    minOrderQuantity: 1000,
    tags: ['sports', 'novelty', 'stadium'],
    specs: SPECS.partyCup,
  }),
  defineProduct({
    slug: 'baseball-home-plate-cup',
    name: 'Baseball Home Plate Cup',
    description:
      'Home plate-shaped cup for baseball-themed concessions and team merch.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['plastic-drinkware'],
    industries: ['sports', 'events'],
    image: 'b/a/baseball_home_plate_cup.jpg',
    materials: ['plastic'],
    minOrderQuantity: 1000,
    tags: ['sports', 'baseball'],
    specs: SPECS.partyCup,
  }),
  defineProduct({
    slug: 'non-stackable-tin-can-cups',
    name: 'Tin Can Cups',
    description:
      'Aluminum tin can-style cup with custom branding. Unique craft beverage activation.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['tin-can-cups', 'aluminum-cups'],
    industries: ['beverage', 'restaurants', 'events'],
    image: 't/i/tin_can_cup_2.jpg',
    materials: ['aluminum'],
    minOrderQuantity: 500,
    tags: ['retro', 'aluminum'],
    specs: { ...SPECS.partyCup, capacityOz: 16 },
  }),
  defineProduct({
    slug: 'acrylic-pineapple-cup',
    name: 'Acrylic Pineapple Cup',
    description:
      'Lightweight acrylic pineapple-shaped cup. Available in gold, silver, copper, and clear finishes.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['pineapple-mug'],
    industries: ['hospitality', 'restaurants', 'events'],
    image: 'p/i/pineapple_cup_gold.png',
    materials: ['acrylic'],
    minOrderQuantity: 250,
    tags: ['themed', 'tiki', 'tropical'],
    popular: true,
    specs: SPECS.partyCup,
    variants: [
      { id: 'gold', label: 'Gold', swatchColor: 'linear-gradient(135deg, #f6d365, #c08a30)', image: { src: cdn('p/i/pineapple_cup_gold.png'), alt: 'Gold Pineapple Cup', width: 800, height: 800 } },
      { id: 'silver', label: 'Silver', swatchColor: 'linear-gradient(135deg, #d8d8d8, #8a8a8a)', image: { src: cdn('p/i/pineapple_cup_silver.png'), alt: 'Silver Pineapple Cup', width: 800, height: 800 } },
      { id: 'copper', label: 'Copper', swatchColor: 'linear-gradient(135deg, #b87333, #7a3e10)', image: { src: cdn('p/i/pineapple_cup_copper.png'), alt: 'Copper Pineapple Cup', width: 800, height: 800 } },
      { id: 'clear', label: 'Clear', swatchColor: 'rgba(255,255,255,0.4)', image: { src: cdn('p/i/pineapple_cup_clear.png'), alt: 'Clear Pineapple Cup', width: 800, height: 800 } },
    ],
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.25, maxHeight: 0.15, surface: 'sphere', curve: 0.25 },
  }),
  defineProduct({
    slug: 'coconut-cup',
    name: 'Coconut Cup',
    description:
      'Realistic coconut-shaped drinkware for tiki bars, beach resorts, and tropical activations.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['coconut-cup'],
    industries: ['hospitality', 'restaurants'],
    image: 'c/o/coconut_cup.jpg',
    materials: ['plastic'],
    minOrderQuantity: 250,
    tags: ['themed', 'tiki', 'tropical'],
    specs: SPECS.partyCup,
  }),
  defineProduct({
    slug: 'sports-bowls',
    name: 'Sports Hat Bowls',
    description:
      'Mini sports helmet bowls in various team configurations. Concessions classic.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['party-balls'],
    industries: ['sports', 'events'],
    image: 's/p/sports_bowls.jpg',
    materials: ['plastic'],
    minOrderQuantity: 1000,
    tags: ['sports', 'concessions', 'helmet'],
    specs: SPECS.partyCup,
  }),
  defineProduct({
    slug: 'sports-shots',
    name: 'Sports Shots',
    description:
      'Themed shot glasses with sports-inspired graphics for tailgates and team venues.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['shot-glasses'],
    industries: ['sports', 'events'],
    image: 's/p/sports_shots.png',
    materials: ['plastic', 'glass'],
    minOrderQuantity: 500,
    tags: ['sports', 'shots'],
    specs: SPECS.shotGlass,
  }),
  defineProduct({
    slug: 'sports-hitch',
    name: 'Sports Hitch Glass',
    description:
      'Beer glass with built-in hitch for hands-free pours during the game.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['glassware'],
    industries: ['sports', 'restaurants'],
    image: 's/p/sports_hitch.jpg',
    materials: ['glass'],
    minOrderQuantity: 250,
    tags: ['sports', 'beer', 'innovative'],
    specs: { ...SPECS.partyCup, capacityOz: 16 },
  }),
  defineProduct({
    slug: 'wine-craffee-750ml',
    name: 'Wine Craffee 750ml',
    description:
      '750ml wine carafe with wine bottle silhouette. Restaurant-grade pour control.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['glassware'],
    industries: ['hospitality', 'restaurants'],
    image: 'w/i/wine-craffee-4.jpg',
    materials: ['glass'],
    minOrderQuantity: 250,
    tags: ['wine', 'carafe'],
    specs: { capacityOz: 25, capacityMl: 750, dimensions: { heightMm: 240 }, weightG: 380, leadTimeDays: { min: 28, max: 42 }, customizationOptions: ['silkscreen', 'pad-print'], origin: 'Imported' },
  }),
  defineProduct({
    slug: 'beer-stein',
    name: 'Beer Stein',
    description:
      'Traditional 16 oz beer stein with handle. Oktoberfest and German-themed venues.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['beer-stein', 'glassware'],
    industries: ['hospitality', 'beverage', 'events'],
    image: '7/_/7.jpg',
    materials: ['glass', 'ceramic'],
    minOrderQuantity: 250,
    tags: ['traditional', 'beer'],
    specs: { ...SPECS.partyCup, capacityOz: 16, dimensions: { heightMm: 180, diameterMm: 90 } },
  }),
  defineProduct({
    slug: 'hurricane-glass',
    name: 'Hurricane Glass',
    description:
      'Curved hurricane glass for tropical cocktails — daiquiris, hurricanes, frozen drinks.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['glassware'],
    industries: ['hospitality', 'restaurants'],
    image: 'h/u/hurricane_glass.jpg',
    materials: ['glass'],
    minOrderQuantity: 250,
    tags: ['cocktail', 'tropical'],
    specs: { capacityOz: 14, capacityMl: 414, dimensions: { heightMm: 210 }, weightG: 280, leadTimeDays: { min: 28, max: 42 }, customizationOptions: ['silkscreen'], origin: 'Imported' },
  }),
  defineProduct({
    slug: 'mexican-cocktail-glass',
    name: 'Mexican Style Cocktail Glass',
    description:
      'Hand-blown Mexican-style cocktail glass with rim detail. Margarita and palomas service.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['glassware'],
    industries: ['hospitality', 'restaurants'],
    image: 'm/a/margarita_mexican_glass.jpg',
    materials: ['glass'],
    minOrderQuantity: 250,
    tags: ['mexican', 'margarita'],
    specs: { ...SPECS.partyCup, capacityOz: 12 },
  }),

  // ===== BAGS — full glacier line + beverage =====
  defineProduct({
    slug: 'glacier-bag-single-blue',
    name: 'Single Bottle Glacier Bag',
    description:
      'Reusable insulated single-bottle carrier in red, blue, or yellow. Standard tote-bag size.',
    categorySlug: 'glacier-bags',
    subcategorySlugs: ['single-bottle'],
    industries: ['beverage', 'hospitality', 'corporate'],
    image: 's/i/single_bottle_glacier_bag_2.jpg',
    materials: ['fabric'],
    minOrderQuantity: 500,
    tags: ['reusable', 'insulated'],
    popular: true,
    specs: SPECS.glacierBag,
    variants: [
      { id: 'blue', label: 'Blue', swatchColor: '#1e40af', image: { src: cdn('s/i/single_bottle_glacier_bag_2.jpg'), alt: 'Blue Glacier Bag', width: 800, height: 800 } },
      { id: 'red', label: 'Red', swatchColor: '#c92335', image: { src: cdn('s/i/single_bottle_glacier_bag_3.jpg'), alt: 'Red Glacier Bag', width: 800, height: 800 } },
      { id: 'yellow', label: 'Yellow', swatchColor: '#f5b800', image: { src: cdn('s/i/single_bottle_glacier_bag.jpg'), alt: 'Yellow Glacier Bag', width: 800, height: 800 } },
    ],
    logoZone: { centerX: 0.5, centerY: 0.5, maxWidth: 0.4, maxHeight: 0.25, surface: 'fabric' },
  }),
  defineProduct({
    slug: 'beverage-bag-with-spigot',
    name: 'Beverage Bag with Spigot',
    description:
      'Carbonated beverage bag with built-in spigot. For mobile bars, festivals, and to-go cocktails.',
    categorySlug: 'beverage-bags',
    subcategorySlugs: ['bag-with-spigot'],
    industries: ['events', 'beverage', 'restaurants'],
    image: 'c/a/carbonated_beverage_bag_1_.png',
    materials: ['plastic'],
    minOrderQuantity: 1000,
    tags: ['carbonated', 'spigot'],
    featured: true,
    specs: SPECS.beveragePouch,
    logoZone: { centerX: 0.5, centerY: 0.45, maxWidth: 0.45, maxHeight: 0.25, surface: 'flat' },
  }),
  defineProduct({
    slug: 'wine-buddy-bag',
    name: 'Wine Buddy Bag',
    description:
      'Insulated wine carrier with shoulder strap and bottle opener pocket. Premium retail packaging.',
    categorySlug: 'glacier-bags',
    subcategorySlugs: ['wine-buddy'],
    industries: ['retail', 'beverage', 'corporate'],
    image: 'w/i/wine_buddy_2.png',
    materials: ['fabric'],
    minOrderQuantity: 500,
    tags: ['wine', 'premium'],
    specs: SPECS.glacierBag,
  }),
  defineProduct({
    slug: 'ice-bucket-bag',
    name: 'Ice Bucket Bag',
    description:
      'Reusable insulated ice bucket bag — collapsible for storage, sturdy when filled.',
    categorySlug: 'glacier-bags',
    subcategorySlugs: ['ice-bucket-bag'],
    industries: ['hospitality', 'beverage', 'events'],
    image: 'i/c/ice_bucket_bag.jpg',
    materials: ['fabric'],
    minOrderQuantity: 500,
    tags: ['ice', 'collapsible'],
    specs: SPECS.glacierBag,
  }),
  defineProduct({
    slug: 'polar-pouch',
    name: 'Polar Pouch',
    description:
      'Insulated drink pouch for cold beverages — collapsible and insulated.',
    categorySlug: 'beverage-bags',
    subcategorySlugs: ['polar-pouch'],
    industries: ['events', 'sports', 'beverage'],
    image: 'p/o/polar_pouch_2.jpg',
    materials: ['fabric', 'plastic'],
    minOrderQuantity: 500,
    tags: ['insulated', 'collapsible'],
    specs: SPECS.beveragePouch,
  }),
  defineProduct({
    slug: 'pocket-mug',
    name: 'Pocket Mug',
    description:
      'Compact foldable mug that fits in your pocket — outdoor and event giveaways.',
    categorySlug: 'beverage-bags',
    subcategorySlugs: ['pocket-mug'],
    industries: ['events', 'corporate'],
    image: 'p/o/pocket_mug_2.jpg',
    materials: ['plastic', 'silicone'],
    minOrderQuantity: 500,
    tags: ['portable', 'foldable'],
    specs: SPECS.beveragePouch,
  }),
  defineProduct({
    slug: 'generic-red-beverage-bag',
    name: 'Red Beverage Bag (Case of 100)',
    description:
      'Generic red beverage bag with custom artwork available. Sold by the case.',
    categorySlug: 'beverage-bags',
    subcategorySlugs: ['generic-bags'],
    industries: ['events', 'restaurants'],
    image: 'g/e/generic_beverage_bag_red.jpg',
    materials: ['plastic'],
    minOrderQuantity: 1000,
    tags: ['bulk', 'case'],
    specs: SPECS.beveragePouch,
  }),
  defineProduct({
    slug: 'generic-blue-beverage-bag',
    name: 'Blue Beverage Bag (Case of 100)',
    description:
      'Generic blue beverage bag with custom artwork. Sold by the case.',
    categorySlug: 'beverage-bags',
    subcategorySlugs: ['generic-bags'],
    industries: ['events', 'restaurants'],
    image: 'b/l/blue_1.jpg',
    materials: ['plastic'],
    minOrderQuantity: 1000,
    tags: ['bulk', 'case'],
    specs: SPECS.beveragePouch,
  }),
  defineProduct({
    slug: 'tote-bag',
    name: 'Custom Tote Bag',
    description:
      'Branded canvas tote bag — corporate gift, event swag, retail ready.',
    categorySlug: 'vaps',
    subcategorySlugs: ['tote-bags'],
    industries: ['corporate', 'retail', 'events'],
    image: 't/o/tote_bag.jpg',
    materials: ['fabric'],
    minOrderQuantity: 500,
    tags: ['eco-friendly', 'reusable'],
    specs: { dimensions: { widthMm: 380, depthMm: 100, heightMm: 380 }, weightG: 110, leadTimeDays: { min: 28, max: 42 }, customizationOptions: ['screen-print', 'embossing'], origin: 'Imported' },
  }),
  defineProduct({
    slug: 'insulated-tote-bag',
    name: 'Insulated Tote Bag',
    description:
      'Premium insulated tote with reinforced bottom. Great for delivery and meal-kit branding.',
    categorySlug: 'vaps',
    subcategorySlugs: ['tote-bags'],
    industries: ['retail', 'corporate', 'restaurants'],
    image: 'i/n/insulated_tote_bag.jpg',
    materials: ['fabric'],
    minOrderQuantity: 250,
    tags: ['insulated', 'premium'],
    specs: { dimensions: { widthMm: 380, depthMm: 220, heightMm: 350 }, weightG: 320, leadTimeDays: { min: 28, max: 42 }, customizationOptions: ['screen-print', 'embossing'], origin: 'Imported' },
  }),

  // ===== GRUB TUBS — full line =====
  defineProduct({
    slug: 'squared-grub-tub',
    name: 'Squared Grub Tub',
    description:
      'Square-shaped Grub Tub for snacks and small bites. Bestseller in the Grub Tub line.',
    categorySlug: 'grub-tubs',
    subcategorySlugs: ['squared'],
    industries: ['sports', 'events', 'restaurants'],
    image: 's/q/square_grub_tub_wix.png',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['best-seller'],
    popular: true,
    specs: { capacityOz: 12, dimensions: { widthMm: 95, depthMm: 95, heightMm: 70 }, weightG: 28, leadTimeDays: { min: 21, max: 35 }, customizationOptions: ['pad-print', 'in-mold-label'], origin: 'Imported' },
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.35, maxHeight: 0.18, surface: 'cylinder', curve: 0.15 },
  }),
  defineProduct({
    slug: 'round-grub-tub',
    name: 'Round Grub Tub',
    description:
      'Classic round Grub Tub — the original snack tub for stadiums and concessions.',
    categorySlug: 'grub-tubs',
    subcategorySlugs: ['round'],
    industries: ['sports', 'events', 'restaurants'],
    image: 'r/o/round_grub_tub_2_wax.png',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['classic', 'best-seller'],
    popular: true,
    specs: { capacityOz: 12, dimensions: { diameterMm: 100, heightMm: 70 }, weightG: 28, leadTimeDays: { min: 21, max: 35 }, customizationOptions: ['pad-print', 'in-mold-label'], origin: 'Imported' },
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.35, maxHeight: 0.18, surface: 'cylinder', curve: 0.15 },
  }),
  defineProduct({
    slug: 'oval-grub-tub',
    name: 'Oval Grub Tub',
    description:
      'Oval Grub Tub variant — stretches the snack profile for chicken tenders, fries, and combos.',
    categorySlug: 'grub-tubs',
    subcategorySlugs: ['oval'],
    industries: ['sports', 'events', 'restaurants'],
    image: 'o/v/oval_grub_tub_2_wix.png',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['oval'],
    specs: { capacityOz: 16, dimensions: { widthMm: 145, depthMm: 80, heightMm: 70 }, weightG: 32, leadTimeDays: { min: 21, max: 35 }, customizationOptions: ['pad-print', 'in-mold-label'], origin: 'Imported' },
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.35, maxHeight: 0.16, surface: 'cylinder', curve: 0.12 },
  }),
  defineProduct({
    slug: 'red-solo-grub-tub',
    name: 'Red Solo Grub Tub',
    description:
      'Red Solo Cup-style Grub Tub — instant nostalgia, party-ready.',
    categorySlug: 'grub-tubs',
    subcategorySlugs: ['acrylic-styrene'],
    industries: ['events', 'sports'],
    image: 'r/e/red_solo_grub_tub_wix.png',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['themed', 'party'],
    specs: { capacityOz: 16, dimensions: { diameterMm: 100, heightMm: 90 }, weightG: 30, leadTimeDays: { min: 21, max: 35 }, customizationOptions: ['pad-print'], origin: 'Imported' },
  }),
  defineProduct({
    slug: 'blue-solo-grub-tub',
    name: 'Blue Solo Grub Tub',
    description:
      'Blue Solo Cup-style Grub Tub variant. Pairs with the red for team colors.',
    categorySlug: 'grub-tubs',
    subcategorySlugs: ['acrylic-styrene'],
    industries: ['events', 'sports'],
    image: 'b/l/blue_solo_grub_tub_wix.png',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['themed', 'party'],
    specs: { capacityOz: 16, dimensions: { diameterMm: 100, heightMm: 90 }, weightG: 30, leadTimeDays: { min: 21, max: 35 }, customizationOptions: ['pad-print'], origin: 'Imported' },
  }),

  // ===== VAPs / Foodware =====
  defineProduct({
    slug: 'red-condiment-trays',
    name: 'Red Condiment Trays',
    description:
      'Red plastic condiment trays — classic restaurant accessory.',
    categorySlug: 'barware',
    subcategorySlugs: ['condiment-trays'],
    industries: ['restaurants', 'hospitality'],
    image: 'c/o/condiment_trays_2.jpg',
    materials: ['plastic'],
    minOrderQuantity: 250,
    tags: ['restaurant'],
  }),
  defineProduct({
    slug: 'black-melamine-silverware-tray',
    name: 'Black Melamine Silverware Tray',
    description:
      'Black melamine silverware tray for restaurant table service. Durable and dishwasher safe.',
    categorySlug: 'vaps',
    subcategorySlugs: ['melamine-silverware'],
    industries: ['restaurants', 'hospitality'],
    image: 'm/e/melamine_tray.jpg',
    materials: ['melamine'],
    minOrderQuantity: 250,
    tags: ['restaurant', 'dishwasher-safe'],
    specs: { dimensions: { widthMm: 230, depthMm: 80, heightMm: 30 }, weightG: 200, leadTimeDays: { min: 28, max: 42 }, customizationOptions: ['silkscreen'], origin: 'Imported' },
  }),
  defineProduct({
    slug: 'red-melamine-silverware-tray',
    name: 'Red Melamine Silverware Tray',
    description:
      'Red melamine silverware tray. Pairs with the black for two-tone restaurant programs.',
    categorySlug: 'vaps',
    subcategorySlugs: ['melamine-silverware'],
    industries: ['restaurants', 'hospitality'],
    image: 'm/e/melamine_tray_2.jpg',
    materials: ['melamine'],
    minOrderQuantity: 250,
    tags: ['restaurant', 'dishwasher-safe'],
    specs: { dimensions: { widthMm: 230, depthMm: 80, heightMm: 30 }, weightG: 200, leadTimeDays: { min: 28, max: 42 }, customizationOptions: ['silkscreen'], origin: 'Imported' },
  }),
  defineProduct({
    slug: 'acrylic-serving-trays',
    name: 'Acrylic Serving Trays',
    description:
      'Premium acrylic serving trays with custom prints. Lightweight, shatter-resistant.',
    categorySlug: 'barware',
    subcategorySlugs: ['serving-trays'],
    industries: ['hospitality', 'restaurants'],
    image: 's/e/serving_trays_3.jpg',
    materials: ['acrylic'],
    minOrderQuantity: 100,
    tags: ['premium', 'serving'],
    specs: { dimensions: { widthMm: 350, depthMm: 250, heightMm: 30 }, weightG: 380, leadTimeDays: { min: 21, max: 35 }, customizationOptions: ['silkscreen', 'sticker'], origin: 'Imported' },
  }),

  // ===== PARTY BALLS / Novelty =====
  defineProduct({
    slug: 'clear-party-balls',
    name: 'Clear Party Balls',
    description:
      'Clear acrylic party ball drinkware. Great for tropical and beach-themed activations.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['party-balls'],
    industries: ['events', 'hospitality'],
    image: 'c/l/clear_party_ball_2.jpg',
    materials: ['acrylic'],
    minOrderQuantity: 500,
    tags: ['themed', 'novelty'],
    specs: SPECS.partyCup,
    logoZone: { centerX: 0.5, centerY: 0.55, maxWidth: 0.25, maxHeight: 0.16, surface: 'sphere', curve: 0.25 },
  }),
  defineProduct({
    slug: 'sport-party-balls',
    name: 'Sport Party Balls',
    description:
      'Sports-themed party balls with team graphics. Stadium concession favorite.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['party-balls'],
    industries: ['sports', 'events'],
    image: 'b/a/baseball_hat_party_ball.jpg',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['sports', 'themed'],
    specs: SPECS.partyCup,
  }),
  defineProduct({
    slug: 'copper-party-balls',
    name: 'Copper Party Balls',
    description:
      'Copper-finish party ball drinkware. Premium tropical look.',
    categorySlug: 'drinkware',
    subcategorySlugs: ['party-balls'],
    industries: ['hospitality', 'events'],
    image: 'c/o/copper_party_ball.jpg',
    materials: ['plastic'],
    minOrderQuantity: 500,
    tags: ['copper', 'premium'],
    specs: SPECS.partyCup,
  }),
]
