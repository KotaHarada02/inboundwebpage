'use client';

import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Badge, DietaryBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { PriceBadge, PriceBreakdownTable } from '@/components/menu/PriceDisplay';
import type { MenuItem } from '@/domain/types';

const SAMPLE_RAMEN_ITEM: MenuItem = {
  id: 'white-miso',
  name: 'White Miso Ramen',
  category: 'Ramen',
  imageUrl: '/images/menu/white-miso.jpg',
  priceYen: {
    normal: 1080,
    '+egg': 1240,
    kake: 700,
    kids: 500,
    special: 1680,
  },
  ingredients: [
    'miso broth',
    'wheat noodles',
    'pork chashu',
    'green onions',
    'bamboo shoots',
    'egg',
  ],
  dietary: ['pork'],
  allergies: ['soy', 'wheat', 'egg', 'dairy'],
  availableAt: ['Lunch', 'Sunset', 'Dinner'],
  description:
    'This is the very first miso ramen ever created at Mitsukabose—a bowl that captures our origins. The soup is made with a smooth white miso base, gently enriched with the comforting aroma of Japanese dashi.',
};

const SAMPLE_VEGAN_ITEM: MenuItem = {
  id: 'vegan-tantanmen',
  name: 'Tantanmen',
  category: 'Ramen',
  imageUrl: '/images/menu/vegan-tantanmen.jpg',
  priceYen: {
    normal: 1180,
    vegan: 1350,
  },
  ingredients: [
    'sesame-chili broth',
    'rice noodles',
    'tofu',
    'green onions',
    'peanuts',
  ],
  dietary: ['Vegan', 'Vegetarian'],
  allergies: ['soy', 'peanuts'],
  availableAt: ['Dinner'],
  description:
    'Crafted without any animal products or fish. We combine a savory base of shiitake mushrooms and kombu seaweed with creamy soy milk and sake kasu from Akishika Sake Brewery.',
};

const COLOR_TOKENS = [
  { name: 'Washi (--background)', hex: '#FBF7F1', bg: 'bg-background' },
  { name: 'Aged Paper (--background-soft)', hex: '#F2EBDF', bg: 'bg-background-soft' },
  { name: 'Sumi Ink (--foreground)', hex: '#1F1A14', bg: 'bg-foreground text-washi' },
  { name: 'Kasshoku (--kasshoku)', hex: '#5B3A29', bg: 'bg-kasshoku text-washi' },
  { name: 'Kasshoku Deep (--kasshoku-deep)', hex: '#3D2418', bg: 'bg-kasshoku-deep text-washi' },
  { name: 'Shibu-Aka (--shibu-aka)', hex: '#B23A2B', bg: 'bg-shibu-aka text-washi' },
  { name: 'Kohaku (--kohaku)', hex: '#C77B30', bg: 'bg-kohaku text-washi' },
  { name: 'Matcha (--matcha)', hex: '#6B8E4E', bg: 'bg-matcha text-washi' },
];

export default function StyleguidePage() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-20">
          <SectionHeader
            as="h1"
            eyebrow="Mitsukabose UI Library"
            title="Component Styleguide"
            subtitleJa="デザインシステム・部品一覧"
            description="Japanese Modern Craft tokens, primitives, compound cards, and menu components."
          />

          {/* 1. Color Tokens */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-kasshoku/15 pb-3">
              1. Color Tokens
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COLOR_TOKENS.map((token) => (
                <Card.Root key={token.name} variant="elevated">
                  <div className={`h-20 p-3 flex items-end ${token.bg}`}>
                    <span className="text-xs font-mono">{token.hex}</span>
                  </div>
                  <Card.Body className="p-3">
                    <p className="text-xs text-foreground font-light">{token.name}</p>
                  </Card.Body>
                </Card.Root>
              ))}
            </div>
          </section>

          {/* 2. Buttons */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-kasshoku/15 pb-3">
              2. Button &amp; ButtonLink Variants
            </h2>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-background-soft/50 rounded-md border border-kasshoku/10">
              <Button variant="primary" size="lg">
                Primary Shine CTA
              </Button>
              <Button variant="outline-dark" size="md">
                Outline Dark
              </Button>
              <ButtonLink href="/menu" variant="primary" size="md">
                ButtonLink to Menu
              </ButtonLink>
            </div>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-kasshoku-deep rounded-md">
              <Button variant="outline-light" size="lg">
                Outline Light (Hero)
              </Button>
              <Button variant="time-active" size="sm">
                17:30〜22:00 Dinner
              </Button>
              <Button variant="time-inactive" size="sm">
                11:30〜14:30 Lunch
              </Button>
            </div>
          </section>

          {/* 3. Badges & Price Display */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-kasshoku/15 pb-3">
              3. Badges &amp; PriceBreakdownTable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card.Root variant="soft">
                <Card.Body>
                  <Card.Title className="mb-4">Badge Variants</Card.Title>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="ingredient">miso broth</Badge>
                    <Badge variant="ingredient">wheat noodles</Badge>
                    <DietaryBadge option="Vegan" />
                    <DietaryBadge option="Vegetarian" />
                    <Badge variant="allergen">soy</Badge>
                    <Badge variant="allergen">wheat</Badge>
                    <Badge variant="category">Sake</Badge>
                    <PriceBadge priceYen={SAMPLE_RAMEN_ITEM.priceYen} />
                  </div>
                </Card.Body>
              </Card.Root>

              <Card.Root variant="soft">
                <Card.Body>
                  <Card.Title className="mb-2">PriceBreakdownTable</Card.Title>
                  <PriceBreakdownTable priceYen={SAMPLE_RAMEN_ITEM.priceYen} />
                </Card.Body>
              </Card.Root>
            </div>
          </section>

          {/* 4. MenuItemCard (Horizontal Scroll Card Component) */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-light text-foreground border-b border-kasshoku/15 pb-3">
              4. MenuItemCard (Horizontal Snap-Scroll Cards)
            </h2>
            <div className="flex overflow-x-auto pb-6 gap-5 snap-x snap-mandatory">
              <MenuItemCard item={SAMPLE_RAMEN_ITEM} index={0} />
              <MenuItemCard item={SAMPLE_VEGAN_ITEM} index={1} />
            </div>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
