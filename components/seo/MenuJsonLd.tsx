import { siteConfig } from '@/lib/siteConfig';
import type { MenuItem, MenuCategory } from '@/domain/types';

const SECTION_LABELS: Record<MenuCategory, string> = {
  Ramen: 'Ramen',
  Kaedama: 'Refill Noodles (Kaedama)',
  Beer: 'Craft Beer',
  JapaneseSake: 'Japanese Sake',
  Wine: 'Wine',
  SoftDrink: 'Soft Drinks',
  Dessert: 'Dessert',
  Ippin: 'Side Dishes (Ippin)',
  LunchSpecial: 'Lunch Specials',
  SunsetSpecial: 'Sunset Specials',
  DinnerSpecial: 'Dinner Specials',
};

function flattenPrice(price: MenuItem['priceYen']): { value: number; key?: string }[] {
  if (typeof price === 'number') return [{ value: price }];
  return Object.entries(price).map(([key, value]) => ({ key, value }));
}

function toMenuItemNode(item: MenuItem) {
  const prices = flattenPrice(item.priceYen);
  const baseOffer = {
    '@type': 'Offer',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Restaurant', name: siteConfig.shortName },
  };

  const offers =
    prices.length === 1
      ? { ...baseOffer, price: String(prices[0].value) }
      : prices.map((p) => ({
          ...baseOffer,
          price: String(p.value),
          name: p.key,
        }));

  return {
    '@type': 'MenuItem',
    '@id': `${siteConfig.url}/menu#${item.id}`,
    name: item.name,
    description: item.description,
    image: `${siteConfig.url}${item.imageUrl}`,
    suitableForDiet: item.dietary?.length
      ? item.dietary
          .map((d) => {
            const map: Record<string, string> = {
              vegan: 'https://schema.org/VeganDiet',
              vegetarian: 'https://schema.org/VegetarianDiet',
              'gluten-free': 'https://schema.org/GlutenFreeDiet',
            };
            return map[d.toLowerCase()] ?? null;
          })
          .filter(Boolean)
      : undefined,
    offers,
  };
}

export function MenuJsonLd({ items }: { items: MenuItem[] }) {
  const byCategory = items.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);

  const sections = (Object.keys(byCategory) as MenuCategory[]).map((cat) => ({
    '@type': 'MenuSection',
    name: SECTION_LABELS[cat] ?? cat,
    hasMenuItem: byCategory[cat].map(toMenuItemNode),
  }));

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${siteConfig.url}/menu#menu`,
    name: 'Mitsukabose Menu',
    description:
      'Full menu including signature white-miso ramen, fermented small plates, Akishika sake, craft beer, and more.',
    inLanguage: ['en', 'ja'],
    hasMenuSection: sections,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
