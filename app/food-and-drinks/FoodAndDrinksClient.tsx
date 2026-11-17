'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getFoodDrinks } from '@/domain/services/dataService';
import type { FoodDrinkItem } from '@/domain/types';
import { DishMediaFrame } from '@/components/ui/DishMediaFrame';
import { hasMenuImage } from '@/lib/menuUtils';

type SectionKey = 'minoh' | 'orize' | 'sake' | 'food';

const PRODUCER_PROFILES: Record<
  SectionKey,
  {
    title: string;
    ja: string;
    origin: string;
    heroImage: string;
    heroAlt: string;
    intro: string;
  }
> = {
  minoh: {
    title: 'Minoh Beer',
    ja: '箕面ビール（大阪・箕面）',
    origin: 'Minoh, Osaka · Since 1997',
    heroImage: '/images/food-and-drinks/minoh.jpg',
    heroAlt: 'Freshly poured pint of Minoh craft beer with Stout and W-IPA bottles',
    intro:
      'Family-run craft brewery at the foot of the Minoh mountains, 15 minutes from our shop. Unfiltered live-yeast ales led by the Ohshita sisters.',
  },
  orize: {
    title: 'Orizé Brewing',
    ja: 'オリゼーブルーイング（米麹ビール）',
    origin: 'Wakayama · Since 2019',
    heroImage: '/images/food-and-drinks/orize-brewing.png',
    heroAlt: 'Storefront and fermentation tanks of Orizé Brewing',
    intro:
      'The world’s first craft brewery to ferment beer with Japanese rice koji instead of barley malt. Naturally gluten-free and aromatic.',
  },
  sake: {
    title: 'Akishika Sake Brewery',
    ja: '秋鹿酒造（大阪・能勢）',
    origin: 'Nose Town, Osaka · Since 1886',
    heroImage: '/images/food-and-drinks/akishika-sake.jpg',
    heroAlt: 'Bottles of Akishika sake from Nose Town served in a glass choko',
    intro:
      'In the mountain valleys of northern Osaka, Akishika grows its own pesticide-free Yamada Nishiki rice and brews pure junmai sake with crisp lactic acidity.',
  },
  food: {
    title: 'Mitsukabose Miso Ramen',
    ja: 'みつか坊主の味噌ラーメン',
    origin: 'Hotarugaike, Osaka',
    heroImage: '/images/food-and-drinks/mitsukabose-food.jpg',
    heroAlt: 'The 2nd-floor dining hall at Mitsukabose in Hotarugaike',
    intro:
      'Slow-brewed white miso, aged red miso blends, Toyono Town Kaachan Miso, and 100% plant-based Vegan Tantanmen enriched with Akishika sake lees.',
  },
};

export default function FoodAndDrinksClient() {
  const items: FoodDrinkItem[] = getFoodDrinks();
  const ORIZE_IDS = new Set([
    'orize-malt-pale-ale',
    'japanese-white-no9-barrel',
    'black-head-ipa',
    'parallel-ipa',
    'oryzae-golden-ale',
  ]);
  const isOrize = (item: FoodDrinkItem) => ORIZE_IDS.has(item.id);

  const minohBeers = items.filter((item) => item.category === 'beer' && !isOrize(item));
  const orizeBeers = items.filter((item) => item.category === 'beer' && isOrize(item));
  const sakes = items.filter((item) => item.category === 'sake');
  const foods = items.filter((item) => item.category === 'ramen');

  const [activeTab, setActiveTab] = useState<SectionKey>('minoh');
  const [selectedItem, setSelectedItem] = useState<FoodDrinkItem | null>(null);

  const minohRef = useRef<HTMLElement>(null);
  const orizeRef = useRef<HTMLElement>(null);
  const sakeRef = useRef<HTMLElement>(null);
  const foodRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

  const scrollToSection = (section: SectionKey) => {
    const refs = { minoh: minohRef, orize: orizeRef, sake: sakeRef, food: foodRef };
    const element = refs[section].current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(section);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          醸造と料理 <span className="text-lg sm:text-xl font-normal text-muted ml-1">Brewers &amp; Food</span>
        </h1>
        <p className="text-xs sm:text-sm text-foreground-soft mt-1.5 max-w-xl">
          Three independent Kansai breweries and our miso kitchen in Hotarugaike.
        </p>
      </header>

      {/* Slim Sticky Jump Strip */}
      <nav
        aria-label="Producer sections"
        className="sticky top-14 z-30 bg-surface/95 backdrop-blur-md border-y border-[color:var(--color-border)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-5">
          {(
            [
              { id: 'minoh', label: 'Minoh Beer' },
              { id: 'orize', label: 'Orizé Rice-Koji' },
              { id: 'sake', label: 'Akishika Sake' },
              { id: 'food', label: 'Miso Ramen' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`flex-none py-2.5 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? 'border-foreground text-foreground font-semibold'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Producer Sections with Horizontal Swipe Rails */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-14">
        <ProducerSection
          sectionRef={minohRef}
          id="minoh"
          profile={PRODUCER_PROFILES.minoh}
          items={minohBeers}
          onSelectItem={setSelectedItem}
        />

        <ProducerSection
          sectionRef={orizeRef}
          id="orize"
          profile={PRODUCER_PROFILES.orize}
          items={orizeBeers}
          onSelectItem={setSelectedItem}
        />

        <ProducerSection
          sectionRef={sakeRef}
          id="sake"
          profile={PRODUCER_PROFILES.sake}
          items={sakes}
          onSelectItem={setSelectedItem}
        />

        <ProducerSection
          sectionRef={foodRef}
          id="food"
          profile={PRODUCER_PROFILES.food}
          items={foods}
          onSelectItem={setSelectedItem}
        />

        <div className="pt-6 border-t border-[color:var(--color-border)] flex items-center justify-between">
          <span className="font-serif text-base text-foreground">
            See prices and time slots on the menu
          </span>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 bg-foreground text-surface text-xs font-medium rounded-full"
          >
            Open Menu
          </Link>
        </div>
      </div>

      {/* Bottom Sheet for Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-50 bg-kasshoku-deep/60"
              aria-hidden="true"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label={selectedItem.name}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50 bg-surface max-h-[85vh] overflow-y-auto overscroll-contain border-t sm:border border-[color:var(--color-border-strong)]"
            >
              {hasMenuImage(selectedItem.imageUrl) && (
                <div className="relative aspect-[4/3] w-full bg-surface-muted">
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    aria-label="Close details"
                    className="absolute top-3 right-3 min-w-[40px] min-h-[40px] px-3 bg-kasshoku-deep/80 text-washi text-xs rounded-full"
                  >
                    Close
                  </button>
                </div>
              )}
              <div className="p-5 sm:p-6 space-y-3">
                {!hasMenuImage(selectedItem.imageUrl) && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="text-xs uppercase tracking-wider text-muted"
                    >
                      Close
                    </button>
                  </div>
                )}
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {selectedItem.name}
                </h2>
                <p className="text-sm text-foreground-soft leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProducerSection({
  sectionRef,
  id,
  profile,
  items,
  onSelectItem,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  id: SectionKey;
  profile: (typeof PRODUCER_PROFILES)[SectionKey];
  items: FoodDrinkItem[];
  onSelectItem: (item: FoodDrinkItem) => void;
}) {
  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`producer-${id}`}
      className="scroll-mt-28 space-y-5"
    >
      {/* Editorial Story Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-5 relative aspect-[16/10] w-full bg-surface-muted overflow-hidden">
          <Image
            src={profile.heroImage}
            alt={profile.heroAlt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
        <div className="md:col-span-7 space-y-1.5">
          <p className="text-xs text-muted">{profile.origin}</p>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2
              id={`producer-${id}`}
              className="font-serif text-2xl font-bold text-foreground"
            >
              {profile.title}
            </h2>
            <span className="text-xs text-urushi" translate="no">
              {profile.ja}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed max-w-xl">
            {profile.intro}
          </p>
        </div>
      </div>

      {/* Horizontal Swipe Rail of Lineup */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 no-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem(item)}
            className="flex-none w-[156px] sm:w-[192px] snap-start text-left group"
          >
            <DishMediaFrame
              src={item.imageUrl}
              alt={item.name}
              category={item.category}
              itemName={item.name}
              aspectClassName="aspect-square"
            />
            <h3 className="font-serif text-sm sm:text-base font-medium text-foreground mt-2 leading-snug line-clamp-2 group-hover:text-urushi transition-colors">
              {item.name}
            </h3>
            <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-relaxed">
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
