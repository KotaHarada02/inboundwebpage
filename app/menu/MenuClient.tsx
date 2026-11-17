'use client';

import type { MenuItem, MenuCategory, TimeSlot } from '@/domain/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, X, Clock, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Provider as TooltipProvider,
  Root as TooltipRoot,
  Trigger as TooltipTrigger,
  Content as TooltipContent,
} from '@radix-ui/react-tooltip';
import { DishMediaFrame } from '@/components/ui/DishMediaFrame';
import {
  getDefaultTimeSlot,
  getPriceEntries,
  getPriceSummary,
  filterMenuItems,
  type DietaryFilter,
} from '@/lib/menuUtils';

const CATEGORY_ORDER: MenuCategory[] = [
  'Ramen',
  'Kaedama',
  'LunchSpecial',
  'SunsetSpecial',
  'DinnerSpecial',
  'Ippin',
  'Beer',
  'JapaneseSake',
  'Wine',
  'SoftDrink',
  'Dessert',
];

const CATEGORY_LABELS: Record<MenuCategory, { en: string; ja: string; description: string }> = {
  Ramen: {
    en: 'Miso Ramen & Tsukemen',
    ja: '味噌ラーメン・つけ麺',
    description: 'Slow-brewed white, red, Toyono Kaachan, and plant-based miso broths paired with house noodles.',
  },
  Kaedama: {
    en: 'Kaedama (Noodle Refills)',
    ja: '替え玉・和え玉',
    description: 'Refill noodles to enjoy with your remaining soup, including seasoned garlic and egg variations.',
  },
  LunchSpecial: {
    en: 'Lunch Sets (11:30–14:30)',
    ja: '昼のお膳・セット',
    description: 'Midday sets including the Fermentation Gozen, Karaage Gozen, and Kids Ramen.',
  },
  SunsetSpecial: {
    en: 'Sunset Specials (14:30–17:30)',
    ja: 'サンセット限定メニュー',
    description: 'Relaxed afternoon fermented vegetable plates, karaage sets, and coffee pairings.',
  },
  DinnerSpecial: {
    en: 'Dinner Sets (17:30–22:00)',
    ja: '夜のお得なセット',
    description: 'Evening side sets to pair with your ramen — small fermented plates, karaage, or rice.',
  },
  Ippin: {
    en: 'Fermented Small Plates & Oden',
    ja: '発酵一品料理・味噌おでん',
    description: 'Seasonal fermented side dishes, miso-simmered oden, local pickles, and house karaage.',
  },
  Beer: {
    en: 'Osaka Craft Beer (Minoh & Orizé)',
    ja: '箕面ビール・オリゼー米麹ビール',
    description: 'Draft and bottled craft beers from Minoh Brewery (Osaka) and gluten-free rice-koji ales from Orizé.',
  },
  JapaneseSake: {
    en: 'Akishika Natural Sake (Nose, Osaka)',
    ja: '能勢・秋鹿酒造の純米酒',
    description: 'Brewed in Nose Town from pesticide-free Yamada Nishiki rice. Expressive umami and crisp acidity that cut through rich miso.',
  },
  Wine: {
    en: 'Japanese Wine',
    ja: '日本ワイン',
    description: 'Curated Japanese Koshu wines and 1.8L isshobin bottles.',
  },
  SoftDrink: {
    en: 'Craft Sodas & Roasted Coffee',
    ja: '自家製発酵ソーダ・豊能サイダー・珈琲',
    description: 'Non-alcoholic Toyono cider, house fermented fruit syrup soda, and house-roasted coffee.',
  },
  Dessert: {
    en: 'Sweets & After-Meal',
    ja: '甘味・デザート',
    description: 'Nostalgic icecrine and rich cheesecake paired with house-roasted coffee.',
  },
};

const TIME_SLOTS: { id: TimeSlot; label: string; hours: string; sub: string }[] = [
  { id: 'Lunch', label: 'Lunch', hours: '11:30–14:30', sub: 'Wed–Sun' },
  { id: 'Sunset', label: 'Sunset', hours: '14:30–17:30', sub: 'Wed–Sun' },
  { id: 'Dinner', label: 'Dinner', hours: '17:30–22:00', sub: 'Wed–Sun' },
  { id: 'Midnight', label: 'Midnight', hours: '22:00–23:30', sub: 'Wed–Sat only' },
];

const DIETARY_FILTERS: { id: DietaryFilter; label: string; countHint?: string }[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'plant-based', label: 'Vegan & Vegetarian' },
  { id: 'no-pork', label: 'Pork-Free (No Pork)' },
  { id: 'spicy', label: 'Spicy' },
];

interface MenuClientProps {
  initialItems: MenuItem[];
}

export default function MenuClient({ initialItems }: MenuClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Ramen');
  const [activeTime, setActiveTime] = useState<TimeSlot>('Dinner');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slotParam = params.get('slot') as TimeSlot | null;
    if (slotParam && ['Lunch', 'Sunset', 'Dinner', 'Midnight'].includes(slotParam)) {
      setActiveTime(slotParam);
    } else {
      setActiveTime(getDefaultTimeSlot(new Date()));
    }
  }, []);

  // Optional live refresh from /api/menu (if Neon DB has newer edits than build-time JSON)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setMenuItems(data as MenuItem[]);
        }
      } catch {
        // Keep initialItems fallback silently
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Close image modal on Escape key
  useEffect(() => {
    if (!enlargedPhoto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlargedPhoto(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enlargedPhoto]);

  const filteredItems = filterMenuItems(menuItems, {
    timeSlot: activeTime,
    dietaryFilter,
  });

  const grouped = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<MenuCategory, MenuItem[]>
  );

  const availableCategories = CATEGORY_ORDER.filter((cat) => (grouped[cat]?.length ?? 0) > 0);

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToCategory = (category: MenuCategory) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(category);
    }
  };

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={100}>
      <div className="min-h-screen bg-surface">
        {/* Accessible Image Modal */}
        <AnimatePresence>
          {enlargedPhoto && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Enlarged photo of ${enlargedPhoto.alt}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-kasshoku-deep/90 p-4"
              onClick={() => setEnlargedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                className="relative max-w-4xl w-full bg-surface-elevated p-2 rounded-xs border border-[color:var(--color-border-strong)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-[color:var(--color-border)]">
                  <p className="font-serif text-sm font-medium text-foreground truncate pr-4">
                    {enlargedPhoto.alt}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEnlargedPhoto(null)}
                    aria-label="Close enlarged photo"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xs text-foreground hover:text-urushi hover:bg-surface-muted transition-colors"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="relative aspect-[4/3] w-full bg-kasshoku-deep">
                  <Image
                    src={enlargedPhoto.src}
                    alt={enlargedPhoto.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <header className="border-b border-[color:var(--color-border-strong)] bg-surface pt-10 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
                  Menu Ledger
                </h1>
                <span className="font-serif text-lg sm:text-xl text-foreground-soft" translate="no">
                  お品書き
                </span>
              </div>
              <p className="mt-2.5 text-base text-foreground-soft measure-prose">
                Our menu shifts through four daily time slots—from midday fermentation sets and
                relaxed afternoon pours to full evening ramen and late-night bowls on Wednesday–Saturday.
              </p>
            </div>

            <div className="text-xs text-foreground-soft bg-surface-muted px-4 py-3 rounded-xs border border-[color:var(--color-border)] space-y-1 font-tabular">
              <p className="font-medium text-foreground">All prices include consumption tax (税込)</p>
              <p>No table charge · Walk-ins only · English &amp; Japanese menu</p>
            </div>
          </div>
        </header>

        {/* Control Deck: Time Slot + Dietary Filter + Category Jump */}
        <section
          aria-label="Menu filters and category navigation"
          className="bg-surface-elevated border-b border-[color:var(--color-border-strong)] sticky top-16 z-30 shadow-[var(--shadow-ledger)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
            {/* Row 1: Time Slot + Dietary Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Time slot buttons */}
              <div
                role="tablist"
                aria-label="Filter menu by time of day"
                className="flex overflow-x-auto no-scrollbar gap-1.5"
              >
                {TIME_SLOTS.map((slot) => {
                  const active = activeTime === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTime(slot.id)}
                      className={`inline-flex items-center gap-2 min-h-[42px] px-3.5 py-1.5 rounded-xs text-xs sm:text-sm font-medium whitespace-nowrap border transition-colors ${
                        active
                          ? 'bg-kasshoku-deep text-washi border-kasshoku-deep'
                          : 'bg-surface text-foreground-soft border-[color:var(--color-border-strong)] hover:text-foreground hover:bg-surface-muted'
                      }`}
                    >
                      <Clock
                        className={`w-3.5 h-3.5 ${active ? 'text-kohaku-soft' : 'text-urushi'}`}
                        aria-hidden="true"
                      />
                      <span>{slot.label}</span>
                      <span
                        className={`font-tabular text-[11px] ${
                          active ? 'text-kohaku-soft' : 'text-muted'
                        }`}
                      >
                        {slot.hours}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dietary preference filter pills */}
              <div
                role="group"
                aria-label="Filter by dietary preference"
                className="flex items-center overflow-x-auto no-scrollbar gap-1.5"
              >
                <span className="text-xs font-medium text-muted mr-1 whitespace-nowrap">
                  Dietary:
                </span>
                {DIETARY_FILTERS.map((filter) => {
                  const active = dietaryFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDietaryFilter(filter.id)}
                      className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                        active
                          ? 'bg-urushi text-washi border-urushi'
                          : 'bg-surface text-foreground-soft border-[color:var(--color-border-strong)] hover:text-foreground hover:bg-surface-muted'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Category Jump Bar */}
            {availableCategories.length > 0 && (
              <nav
                aria-label="Jump to menu category"
                className="flex items-center overflow-x-auto no-scrollbar gap-1 pt-2 border-t border-[color:var(--color-border)]"
              >
                {availableCategories.map((cat) => {
                  const active = activeCategory === cat;
                  const count = grouped[cat]?.length ?? 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => scrollToCategory(cat)}
                      className={`inline-flex items-baseline gap-1.5 min-h-[38px] px-3 py-1.5 text-xs sm:text-sm rounded-xs whitespace-nowrap transition-colors ${
                        active
                          ? 'bg-surface-muted text-urushi font-semibold'
                          : 'text-foreground-soft hover:text-urushi hover:bg-surface-muted/50'
                      }`}
                    >
                      <span>{CATEGORY_LABELS[cat].en}</span>
                      <span className="font-tabular text-[11px] text-muted">({count})</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
        </section>

        {/* Menu Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Actionable Empty State when filter combination yields 0 items */}
          {availableCategories.length === 0 ? (
            <div className="ledger-frame p-8 sm:p-12 text-center max-w-xl mx-auto my-8 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                No dishes match this combination in {activeTime}
              </h2>
              <p className="text-sm text-foreground-soft leading-relaxed">
                Some specialty bowls (such as our 100% plant-based Vegan Tantanmen and Red Miso
                Ramen) are prepared specifically for Dinner service (17:30–22:00).
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDietaryFilter('all')}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 bg-urushi hover:bg-urushi-deep text-washi text-xs sm:text-sm font-medium rounded-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Show All {activeTime} Dishes</span>
                </button>
                {activeTime !== 'Dinner' && (
                  <button
                    type="button"
                    onClick={() => setActiveTime('Dinner')}
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 bg-surface-muted hover:bg-surface text-foreground border border-[color:var(--color-border-strong)] text-xs sm:text-sm font-medium rounded-xs transition-colors"
                  >
                    <span>Switch to Dinner Menu (17:30–22:00)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-20">
              {availableCategories.map((cat) => {
                const items = grouped[cat];
                const meta = CATEGORY_LABELS[cat];
                return (
                  <section
                    key={cat}
                    id={`category-${cat}`}
                    aria-labelledby={`heading-${cat}`}
                    className="scroll-mt-44"
                  >
                    {/* Category Header */}
                    <div className="border-b-2 border-[color:var(--color-border-strong)] pb-4 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <h2
                            id={`heading-${cat}`}
                            className="font-serif text-2xl sm:text-3xl font-bold text-foreground"
                          >
                            {meta.en}
                          </h2>
                          <span className="font-serif text-sm text-urushi font-medium" translate="no">
                            {meta.ja}
                          </span>
                        </div>
                        <p className="text-sm text-foreground-soft mt-1.5 measure-prose">
                          {meta.description}
                        </p>
                      </div>
                      <span className="font-tabular text-xs text-muted whitespace-nowrap">
                        {items.length} {items.length === 1 ? 'item' : 'items'} in {activeTime}
                      </span>
                    </div>

                    {/* Responsive Ledger Grid (replaces horizontal-only w-72 strip) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => {
                        const priceEntries = getPriceEntries(item.priceYen);
                        const priceSummary = getPriceSummary(item.priceYen);
                        const isExpanded = !!expandedDescriptions[item.id];

                        return (
                          <article
                            key={item.id}
                            className="ledger-frame overflow-hidden flex flex-col justify-between bg-surface-elevated"
                          >
                            <div>
                              <DishMediaFrame
                                src={item.imageUrl}
                                alt={item.name}
                                category={item.category}
                                itemName={item.name}
                                priceBadge={priceSummary}
                                onSelectImage={(src, alt) => setEnlargedPhoto({ src, alt })}
                              />

                              <div className="p-5 space-y-3.5">
                                <div className="flex items-baseline justify-between gap-3">
                                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground leading-snug">
                                    {item.name}
                                  </h3>
                                  {priceEntries.length === 1 && (
                                    <span className="font-tabular text-base font-semibold text-foreground whitespace-nowrap">
                                      {priceEntries[0].formatted}
                                    </span>
                                  )}
                                </div>

                                {/* Multi-size price table */}
                                {priceEntries.length > 1 && (
                                  <dl className="bg-surface-muted/70 px-3.5 py-2.5 rounded-xs border border-[color:var(--color-border)] space-y-1 text-xs">
                                    {priceEntries.map((entry) => (
                                      <div
                                        key={entry.label}
                                        className="flex items-baseline justify-between gap-2 border-b last:border-b-0 border-dotted border-[color:var(--color-border)] pb-1 last:pb-0"
                                      >
                                        <dt className="text-foreground-soft capitalize">
                                          {entry.label}
                                        </dt>
                                        <dd className="font-tabular font-semibold text-foreground">
                                          {entry.formatted}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                )}

                                {/* Description */}
                                {item.description && (
                                  <div>
                                    <p
                                      className={`text-foreground-soft text-sm leading-relaxed ${
                                        isExpanded ? '' : 'line-clamp-3'
                                      }`}
                                    >
                                      {item.description}
                                    </p>
                                    {item.description.length > 135 && (
                                      <button
                                        type="button"
                                        onClick={() => toggleDescription(item.id)}
                                        className="inline-flex items-center gap-1 mt-1.5 py-1 text-xs font-medium text-urushi hover:text-urushi-deep transition-colors"
                                      >
                                        {isExpanded ? (
                                          <>
                                            <span>Show less</span>
                                            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                                          </>
                                        ) : (
                                          <>
                                            <span>Read full description</span>
                                            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Footer metadata: Ingredients, Dietary & Allergens */}
                            <div className="px-5 pb-5 pt-3 border-t border-[color:var(--color-border)] space-y-2.5 text-xs">
                              {item.ingredients && item.ingredients.length > 0 && (
                                <p className="text-muted leading-snug">
                                  <strong className="font-medium text-foreground-soft">
                                    Key ingredients:
                                  </strong>{' '}
                                  {item.ingredients.join(', ')}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-1.5">
                                {item.dietary?.map((opt, i) => {
                                  const lower = opt.toLowerCase();
                                  const isPlant =
                                    lower.includes('vegan') ||
                                    lower.includes('vegetarian') ||
                                    lower.includes('ビーガン') ||
                                    lower.includes('ベジタリアン');
                                  return (
                                    <TooltipRoot key={`${opt}-${i}`}>
                                      <TooltipTrigger asChild>
                                        <span
                                          tabIndex={0}
                                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium cursor-help ${
                                            isPlant
                                              ? 'bg-koji/12 text-koji border border-koji/30'
                                              : 'bg-surface-muted text-foreground-soft border border-[color:var(--color-border)]'
                                          }`}
                                        >
                                          <span>{opt}</span>
                                          <Info className="w-3 h-3" aria-hidden="true" />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="top"
                                        className="z-50 bg-kasshoku-deep text-washi text-xs px-3 py-2 rounded-xs shadow-lg max-w-xs"
                                      >
                                        {getDietaryDescription(opt)}
                                      </TooltipContent>
                                    </TooltipRoot>
                                  );
                                })}

                                {item.allergies && item.allergies.length > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] bg-urushi/10 text-urushi border border-urushi/25">
                                    Allergens: {item.allergies.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

function getDietaryDescription(option: string): string {
  const descriptions: Record<string, string> = {
    Vegetarian: 'Contains no meat, poultry, fish, or seafood; may contain eggs or dairy.',
    Vegan: '100% plant-based — contains no animal products, fish dashi, or dairy.',
    'Gluten-Free': 'Brewed or prepared without wheat, barley, or rye.',
    pork: 'Contains pork chashu or pork-based seasoning.',
    spicy: 'Prepared with house chili oil or Korean-style spicy miso.',
    seafood: 'Contains clams, shrimp, or seafood dashi.',
    ベジタリアン: 'Contains no meat, poultry, fish, or seafood; may contain eggs or dairy.',
    ビーガン: '100% plant-based — contains no animal products whatsoever.',
  };

  return descriptions[option] || option;
}
