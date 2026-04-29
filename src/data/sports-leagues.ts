import type { Product } from '@/types/product'

export type LeagueSlug = 'nfl' | 'mlb' | 'nba' | 'nhl' | 'mls'

export interface SportsLeague {
  slug: LeagueSlug
  shortName: string
  fullName: string
  apiName: 'NFL' | 'MLB' | 'NBA' | 'NHL' | 'MLS'
  /** Tagline shown under the page hero */
  tagline: string
  /** Long-form intro paragraph */
  intro: string
  /** Tailwind class for the accent gradient (left side of hero) */
  accentGradient: string
  /** Solid accent color used on chips, scores, badges */
  accentColor: string
  /** Tag values to favor when filtering products for this league */
  productTags: string[]
  /** Subcategory slugs that are most relevant for this league */
  preferredSubcategories: string[]
  /** Case study lead — placeholder copy until real ones are wired up */
  caseStudy: {
    venue: string
    quote: string
    attendee: string
    metric: string
  }
}

export const sportsLeagues: SportsLeague[] = [
  {
    slug: 'nfl',
    shortName: 'NFL',
    fullName: 'National Football League',
    apiName: 'NFL',
    tagline: 'Concession-ready drinkware for game day',
    intro:
      'From premium suite Moscow Mules to 16 oz tailgate party cups in team colors, we build NFL stadium programs that hold up to fall through the playoffs. Football helmet shakers, foldable yards, and reusable beverage carriers are our most-ordered SKUs in this category.',
    accentGradient: 'from-emerald-700 via-emerald-600 to-emerald-700',
    accentColor: 'rgb(16,185,129)',
    productTags: ['football', 'tailgate', 'stadium', 'sports'],
    preferredSubcategories: [
      'shakers',
      'plastic-drinkware',
      'foldable-yard',
      'glassware',
      'party-balls',
    ],
    caseStudy: {
      venue: 'A Top-5 NFL Concessionaire',
      quote:
        '“RP keeps every gate stocked through the playoffs. We never miss a Sunday because of supply.”',
      attendee: 'Concessions Director',
      metric: '500K+ branded units shipped per season',
    },
  },
  {
    slug: 'mlb',
    shortName: 'MLB',
    fullName: 'Major League Baseball',
    apiName: 'MLB',
    tagline: '162-game stadium programs with custom concessions',
    intro:
      'Baseball is a marathon, not a sprint — your concession line needs to last 81 home games. Baseball pint glasses, home plate cups, baseball-bat tumblers, and helmet shakers in your team colors are bread-and-butter for MLB clubs. We also stock craft-brewery branded pint glass programs for stadium-adjacent breweries.',
    accentGradient: 'from-blue-700 via-blue-600 to-blue-700',
    accentColor: 'rgb(59,130,246)',
    productTags: ['baseball', 'sports', 'stadium'],
    preferredSubcategories: [
      'plastic-drinkware',
      'glassware',
      'shakers',
      'party-cup',
      'shot-glasses',
    ],
    caseStudy: {
      venue: 'A National League Stadium',
      quote:
        '“Our team-color mugs sold out three home stands in a row. We restocked twice with RP and never blew a deadline.”',
      attendee: 'Director of Retail',
      metric: '1.2M units across 4 SKUs in one season',
    },
  },
  {
    slug: 'nba',
    shortName: 'NBA',
    fullName: 'National Basketball Association',
    apiName: 'NBA',
    tagline: 'Premium suite & courtside programs',
    intro:
      'NBA arenas blend retail, concession, and luxury suite — and our line covers all three. Premium copper Moscow Mules for VIP suites, party cups in team colorways for the 200 level, and crystal shot glasses for in-arena bars. Basketball-themed shakers also play well as merch giveaways.',
    accentGradient: 'from-orange-600 via-orange-500 to-orange-600',
    accentColor: 'rgb(249,115,22)',
    productTags: ['basketball', 'sports', 'stadium', 'premium'],
    preferredSubcategories: [
      'shakers',
      'classic',
      'pure-copper',
      'glassware',
      'shot-glasses',
    ],
    caseStudy: {
      venue: 'A Western Conference Arena',
      quote:
        '“We rolled out two suite-level Moscow Mule programs and a courtside premium tumbler line with RP. Reorders every season.”',
      attendee: 'Premium Hospitality Lead',
      metric: '8 SKUs in active rotation',
    },
  },
  {
    slug: 'nhl',
    shortName: 'NHL',
    fullName: 'National Hockey League',
    apiName: 'NHL',
    tagline: 'Hockey arena programs that survive the season',
    intro:
      'NHL arenas need durability and team character. Our goalie mask shakers, jersey-numbered pint glasses, and stainless steel insulated tumblers ship to franchises across both conferences. Hockey-specific novelty drinkware drives stadium retail revenue alongside the standard concession line.',
    accentGradient: 'from-cyan-700 via-cyan-600 to-cyan-700',
    accentColor: 'rgb(6,182,212)',
    productTags: ['hockey', 'sports', 'stadium'],
    preferredSubcategories: ['shakers', 'glassware', 'plastic-drinkware'],
    caseStudy: {
      venue: 'An Original-Six Franchise',
      quote:
        '“The goalie mask shakers were one of the fastest-selling team-store items of the year. We reordered three times before the All-Star break.”',
      attendee: 'Team Store Buyer',
      metric: 'Sold-out within 6 home games',
    },
  },
  {
    slug: 'mls',
    shortName: 'MLS',
    fullName: 'Major League Soccer',
    apiName: 'MLS',
    tagline: 'Match-day programs for North America\'s fastest-growing league',
    intro:
      'MLS clubs from Atlanta to LA run end-to-end concession programs with us — pint glasses, party cups, and beverage pouches in club colors, plus club-branded glacier bags for fan retail. Bilingual graphic capabilities (English/Spanish) make us the go-to for Liga MX-affiliated venues too.',
    accentGradient: 'from-pink-600 via-pink-500 to-pink-600',
    accentColor: 'rgb(236,72,153)',
    productTags: ['soccer', 'sports', 'stadium'],
    preferredSubcategories: ['plastic-drinkware', 'glassware', 'beverage-pouch', 'foldable-yard'],
    caseStudy: {
      venue: 'A Major MLS Franchise',
      quote:
        '“Bilingual artwork, on-time delivery, MLS-licensed program. RP nailed the brief for our home opener.”',
      attendee: 'Brand Activation Lead',
      metric: '3 active SKUs, 240K+ units',
    },
  },
]

export const leagueBySlug = Object.fromEntries(
  sportsLeagues.map((l) => [l.slug, l]),
) as Record<LeagueSlug, SportsLeague>

/**
 * Score products for a league based on:
 * - tag overlap with league.productTags
 * - subcategory overlap with league.preferredSubcategories
 * - matches the 'sports' industry
 *
 * Returns top N products sorted by score descending.
 */
export function curateProductsForLeague(
  league: SportsLeague,
  allProducts: Product[],
  limit = 12,
): Product[] {
  const scored = allProducts
    .map((p) => {
      let score = 0
      if (p.industries.includes('sports')) score += 3
      for (const tag of p.tags) {
        if (league.productTags.includes(tag.toLowerCase())) score += 2
      }
      for (const sub of p.subcategorySlugs) {
        if (league.preferredSubcategories.includes(sub)) score += 1
      }
      // Featured bonus
      if (p.featured) score += 1
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((x) => x.p)
}
