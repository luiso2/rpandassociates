import type { Subcategory } from '@/types/category'

/**
 * Subcategories — flat list with category mapping. Slugs are unique across all categories.
 * Build-time validator (Phase 7) ensures referential integrity with `categories.subcategorySlugs[]`.
 */
export const subcategories: Subcategory[] = [
  // ==== BARWARE ====
  { slug: 'shakers', categorySlug: 'barware', name: 'Cocktail Shakers', productSlugs: [] },
  { slug: 'straws', categorySlug: 'barware', name: 'Straws', productSlugs: [] },
  { slug: 'flasks', categorySlug: 'barware', name: 'Flasks', productSlugs: [] },
  { slug: 'air-lights', categorySlug: 'barware', name: 'Air Lights', productSlugs: [] },
  { slug: 'bar-mats', categorySlug: 'barware', name: 'Bar Mats', productSlugs: [] },
  { slug: 'bottle-glorifiers', categorySlug: 'barware', name: 'Bottle Glorifiers', productSlugs: [] },
  { slug: 'bottle-openers', categorySlug: 'barware', name: 'Bottle Openers', productSlugs: [] },
  { slug: 'condiment-holders', categorySlug: 'barware', name: 'Condiment Holders', productSlugs: [] },
  { slug: 'condiment-trays', categorySlug: 'barware', name: 'Condiment Trays', productSlugs: [] },
  { slug: 'cork-coasters', categorySlug: 'barware', name: 'Cork Coasters', productSlugs: [] },
  { slug: 'custom-stir-rods', categorySlug: 'barware', name: 'Custom Stir Rods', productSlugs: [] },
  { slug: 'silicon-ice-trays', categorySlug: 'barware', name: 'Custom Silicon Ice Trays', productSlugs: [] },
  { slug: 'flight-tray-paddles', categorySlug: 'barware', name: 'Flight Tray Paddles', productSlugs: [] },
  { slug: 'growlers', categorySlug: 'barware', name: 'Growlers', productSlugs: [] },
  { slug: 'ice-buckets', categorySlug: 'barware', name: 'Ice Buckets', productSlugs: [] },
  { slug: 'key-chain-bottle-openers', categorySlug: 'barware', name: 'Key Chain Bottle Openers', productSlugs: [] },
  { slug: 'mini-hat-bottle-toppers', categorySlug: 'barware', name: 'Mini Hat Bottle Toppers', productSlugs: [] },
  { slug: 'maraca-shakers', categorySlug: 'barware', name: 'Maraca Cocktail Shakers', productSlugs: [] },
  { slug: 'napkin-caddies', categorySlug: 'barware', name: 'Napkin Caddies', productSlugs: [] },
  { slug: 'serving-trays', categorySlug: 'barware', name: 'Serving Trays', productSlugs: [] },
  { slug: 'squeeze-jiggers', categorySlug: 'barware', name: 'Squeeze Jiggers', productSlugs: [] },
  { slug: 'wine-pourers', categorySlug: 'barware', name: 'Wine Pourers', productSlugs: [] },
  { slug: 'wrist-band-koozies', categorySlug: 'barware', name: 'Wrist Band Koozies', productSlugs: [] },

  // ==== BEVERAGE BAGS ====
  { slug: 'aluminum-bag', categorySlug: 'beverage-bags', name: 'Aluminum Bag', productSlugs: [] },
  { slug: 'o-ring-bag', categorySlug: 'beverage-bags', name: 'O-Ring Bag', productSlugs: [] },
  { slug: '15-gallon-bag', categorySlug: 'beverage-bags', name: '1.5 Gallon Bag', productSlugs: [] },
  { slug: 'bag-with-box', categorySlug: 'beverage-bags', name: 'Bag with Box', productSlugs: [] },
  { slug: 'beverage-pouch', categorySlug: 'beverage-bags', name: 'Beverage Pouch', productSlugs: [] },
  { slug: 'bag-sleeves', categorySlug: 'beverage-bags', name: 'Bag Sleeves', productSlugs: [] },
  { slug: 'generic-bags', categorySlug: 'beverage-bags', name: 'Generic Bags', productSlugs: [] },
  { slug: 'carbonated-bag', categorySlug: 'beverage-bags', name: 'Carbonated Bag', productSlugs: [] },
  { slug: 'infusion-jar-bag', categorySlug: 'beverage-bags', name: 'Infusion Jar Bag', productSlugs: [] },
  { slug: 'coffee-bag', categorySlug: 'beverage-bags', name: 'Coffee Bag', productSlugs: [] },
  { slug: 'foldable-yard', categorySlug: 'beverage-bags', name: 'Foldable Yard', productSlugs: [] },
  { slug: 'wide-mouth', categorySlug: 'beverage-bags', name: 'Wide Mouth', productSlugs: [] },
  { slug: 'bag-with-spigot', categorySlug: 'beverage-bags', name: 'Bag with Spigot', productSlugs: [] },
  { slug: 'milk-bags', categorySlug: 'beverage-bags', name: 'Milk Bags', productSlugs: [] },
  { slug: 'pocket-mug', categorySlug: 'beverage-bags', name: 'Pocket Mug', productSlugs: [] },
  { slug: 'polar-pouch', categorySlug: 'beverage-bags', name: 'Polar Pouch', productSlugs: [] },
  { slug: 'custom-lids', categorySlug: 'beverage-bags', name: 'Custom Lids', productSlugs: [] },
  { slug: 'sangria-bag', categorySlug: 'beverage-bags', name: 'Sangria Bag', productSlugs: [] },
  { slug: 'soup-bags', categorySlug: 'beverage-bags', name: 'Soup Bags', productSlugs: [] },
  { slug: 'ice-cream-pouches', categorySlug: 'beverage-bags', name: 'Ice Cream Pouches', productSlugs: [] },

  // ==== DRINKWARE ====
  { slug: 'plastic-drinkware', categorySlug: 'drinkware', name: 'Plastic Drinkware', productSlugs: [] },
  { slug: 'disposable-cups', categorySlug: 'drinkware', name: 'Disposable Cups', productSlugs: [] },
  { slug: 'glassware', categorySlug: 'drinkware', name: 'Glassware', productSlugs: [] },
  { slug: 'party-balls', categorySlug: 'drinkware', name: 'Party Balls', productSlugs: [] },
  { slug: 'shot-glasses', categorySlug: 'drinkware', name: 'Shot Glasses', productSlugs: [] },
  { slug: 'aluminum-cans', categorySlug: 'drinkware', name: 'Aluminum Cans', productSlugs: [] },
  { slug: 'aluminum-cups', categorySlug: 'drinkware', name: 'Aluminum Cups', productSlugs: [] },
  { slug: 'beer-stein', categorySlug: 'drinkware', name: 'Beer Stein', productSlugs: [] },
  { slug: 'beertail', categorySlug: 'drinkware', name: 'Beertail', productSlugs: [] },
  { slug: 'blinking-drinkware', categorySlug: 'drinkware', name: 'Blinking Drinkware', productSlugs: [] },
  { slug: 'cantail', categorySlug: 'drinkware', name: 'Cantail', productSlugs: [] },
  { slug: 'coconut-cup', categorySlug: 'drinkware', name: 'Coconut Cup', productSlugs: [] },
  { slug: 'coffee-sleeves', categorySlug: 'drinkware', name: 'Coffee Sleeves', productSlugs: [] },
  { slug: 'drink-holder', categorySlug: 'drinkware', name: 'Drink Holder', productSlugs: [] },
  { slug: 'enamel-mug', categorySlug: 'drinkware', name: 'Enamel Mug', productSlugs: [] },
  { slug: 'ornament-tumbler', categorySlug: 'drinkware', name: 'Ornament Tumbler', productSlugs: [] },
  { slug: 'party-cup', categorySlug: 'drinkware', name: 'Party Cup', productSlugs: [] },
  { slug: 'pineapple-mug', categorySlug: 'drinkware', name: 'Pineapple Mug', productSlugs: [] },
  { slug: 'steel-cups', categorySlug: 'drinkware', name: 'Steel Cups', productSlugs: [] },
  { slug: 'the-cuff', categorySlug: 'drinkware', name: 'The Cuff', productSlugs: [] },
  { slug: 'the-orb', categorySlug: 'drinkware', name: 'The Orb', productSlugs: [] },
  { slug: 'tiki-mugs', categorySlug: 'drinkware', name: 'Tiki Mugs', productSlugs: [] },
  { slug: 'tin-can-cups', categorySlug: 'drinkware', name: 'Tin Can Cups', productSlugs: [] },
  { slug: 'tire-mug', categorySlug: 'drinkware', name: 'Tire Mug', productSlugs: [] },
  { slug: 'winebox', categorySlug: 'drinkware', name: 'Winebox', productSlugs: [] },
  { slug: 'ugly-christmas-sweater-insulators', categorySlug: 'drinkware', name: 'Ugly Christmas Sweater Insulators', productSlugs: [] },
  { slug: 'oktober-fest', categorySlug: 'drinkware', name: 'Oktoberfest', productSlugs: [] },

  // ==== GLACIER BAGS ====
  { slug: '6-pack', categorySlug: 'glacier-bags', name: '6-Pack', productSlugs: [] },
  { slug: 'single-bottle', categorySlug: 'glacier-bags', name: 'Single Bottle', productSlugs: [] },
  { slug: 'dog-bags', categorySlug: 'glacier-bags', name: 'Dog Bags', productSlugs: [] },
  { slug: 'watering-bags', categorySlug: 'glacier-bags', name: 'Watering Bags', productSlugs: [] },
  { slug: 'giant-ice-bucket-bag', categorySlug: 'glacier-bags', name: 'Giant Ice Bucket Bag', productSlugs: [] },
  { slug: 'big-globe-bag', categorySlug: 'glacier-bags', name: 'Big Globe Bag', productSlugs: [] },
  { slug: 'ice-bucket-bag', categorySlug: 'glacier-bags', name: 'Ice Bucket Bag', productSlugs: [] },
  { slug: 'how-its-being-used', categorySlug: 'glacier-bags', name: 'How It’s Being Used', productSlugs: [] },
  { slug: 'reusable-bulk-food-bags', categorySlug: 'glacier-bags', name: 'Reusable Bulk Food Bags', productSlugs: [] },
  { slug: 'wet-dry-bag-plus', categorySlug: 'glacier-bags', name: 'Wet/Dry Bag Plus', productSlugs: [] },
  { slug: 'wine-buddy', categorySlug: 'glacier-bags', name: 'Wine Buddy', productSlugs: [] },

  // ==== GRUB TUBS ====
  { slug: 'acrylic-styrene', categorySlug: 'grub-tubs', name: 'Acrylic Styrene', productSlugs: [] },
  { slug: 'bamboo', categorySlug: 'grub-tubs', name: 'Bamboo', productSlugs: [] },
  { slug: 'clear', categorySlug: 'grub-tubs', name: 'Clear', productSlugs: [] },
  { slug: 'oval', categorySlug: 'grub-tubs', name: 'Oval', productSlugs: [] },
  { slug: 'round', categorySlug: 'grub-tubs', name: 'Round', productSlugs: [] },
  { slug: 'squared', categorySlug: 'grub-tubs', name: 'Squared', productSlugs: [] },
  { slug: '3d-model', categorySlug: 'grub-tubs', name: '3D Model', productSlugs: [] },

  // ==== MULE MUGS ====
  { slug: 'acrylic-classic', categorySlug: 'mule-mugs', name: 'Acrylic Classic / Mini / Stackable', productSlugs: [] },
  { slug: 'floating-artisan', categorySlug: 'mule-mugs', name: 'Floating Artisan / Punch / Classic', productSlugs: [] },
  { slug: 'mini-acrylic', categorySlug: 'mule-mugs', name: 'Mini Acrylic / Artisan / Stainless Steel', productSlugs: [] },
  { slug: 'artisan', categorySlug: 'mule-mugs', name: 'Artisan', productSlugs: [] },
  { slug: 'bolted', categorySlug: 'mule-mugs', name: 'Bolted', productSlugs: [] },
  { slug: 'classic', categorySlug: 'mule-mugs', name: 'Classic', productSlugs: [] },
  { slug: 'classic-dutch', categorySlug: 'mule-mugs', name: 'Classic Dutch', productSlugs: [] },
  { slug: 'colorful', categorySlug: 'mule-mugs', name: 'Colorful', productSlugs: [] },
  { slug: 'custom-design', categorySlug: 'mule-mugs', name: 'Custom Design', productSlugs: [] },
  { slug: 'giant-shareable', categorySlug: 'mule-mugs', name: 'Giant / Shareable', productSlugs: [] },
  { slug: 'hammered', categorySlug: 'mule-mugs', name: 'Hammered', productSlugs: [] },
  { slug: 'hammered-highball', categorySlug: 'mule-mugs', name: 'Hammered Highball', productSlugs: [] },
  { slug: 'punch', categorySlug: 'mule-mugs', name: 'Punch', productSlugs: [] },
  { slug: 'pure-copper', categorySlug: 'mule-mugs', name: 'Pure Copper', productSlugs: [] },
  { slug: 'riveted', categorySlug: 'mule-mugs', name: 'Riveted', productSlugs: [] },
  { slug: 'russian', categorySlug: 'mule-mugs', name: 'Russian', productSlugs: [] },

  // ==== VAPS & MORE ====
  { slug: 'value-added-packaging', categorySlug: 'vaps', name: 'Value-Added Packaging', productSlugs: [] },
  { slug: 'closeout-sale', categorySlug: 'vaps', name: 'Closeout Sale', productSlugs: [] },
  { slug: 'custom-coolers', categorySlug: 'vaps', name: 'Custom Coolers', productSlugs: [] },
  { slug: '6-pack-carrier', categorySlug: 'vaps', name: '6-Pack Carrier', productSlugs: [] },
  { slug: 'catering-trays', categorySlug: 'vaps', name: 'Catering Trays', productSlugs: [] },
  { slug: 'custom-50ml-displays', categorySlug: 'vaps', name: 'Custom 50ml Displays', productSlugs: [] },
  { slug: 'ice-cream-snack-bowls', categorySlug: 'vaps', name: 'Ice Cream & Snack Bowls', productSlugs: [] },
  { slug: 'electronics', categorySlug: 'vaps', name: 'Electronics', productSlugs: [] },
  { slug: 'light-up-labels', categorySlug: 'vaps', name: 'Light-Up Labels', productSlugs: [] },
  { slug: 'popcorn-boxes', categorySlug: 'vaps', name: 'Popcorn Boxes', productSlugs: [] },
  { slug: 'tote-bags', categorySlug: 'vaps', name: 'Tote Bags', productSlugs: [] },
  { slug: 'other-products', categorySlug: 'vaps', name: 'Other Products', productSlugs: [] },
  { slug: 'healthcare', categorySlug: 'vaps', name: 'Healthcare', productSlugs: [] },
  { slug: 'wooden-displays', categorySlug: 'vaps', name: 'Wooden Displays', productSlugs: [] },
  { slug: 'metal-displays', categorySlug: 'vaps', name: 'Metal Displays', productSlugs: [] },
  { slug: 'melamine-silverware', categorySlug: 'vaps', name: 'Melamine Silverware Trays', productSlugs: [] },
]

export const subcategoriesByCategory = subcategories.reduce<
  Record<string, Subcategory[]>
>((acc, sub) => {
  if (!acc[sub.categorySlug]) acc[sub.categorySlug] = []
  acc[sub.categorySlug].push(sub)
  return acc
}, {})

export const subcategoryBySlug = Object.fromEntries(
  subcategories.map((s) => [s.slug, s]),
) as Record<string, Subcategory>
