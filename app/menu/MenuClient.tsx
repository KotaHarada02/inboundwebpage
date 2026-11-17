'use client';

import type { MenuItem, MenuCategory, TimeSlot } from '@/domain/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DishMediaFrame } from '@/components/ui/DishMediaFrame';
import {
  getDefaultTimeSlot,
  getPriceEntries,
  getPriceSummary,
  filterMenuItems,
  hasMenuImage,
  type DietaryFilter,
} from '@/lib/menuUtils';

const CATEGORY_ORDER: MenuCategory[] = [
  'Ramen',
  'Kaedama',
  'Ippin',
  'Beer',
  'JapaneseSake',
  'LunchSpecial',
  'SunsetSpecial',
  'DinnerSpecial',
  'Wine',
  'SoftDrink',
  'Dessert',
];

const CATEGORY_LABELS: Record<MenuCategory, { en: string; ja: string; description: string }> = {
  Ramen: {
    en: 'Ramen & Tsukemen',
    ja: '味噌ラーメン・つけ麺',
    description: 'White miso, aged red miso, Toyono Kaachan miso, and vegan tantanmen.',
  },
  Kaedama: {
    en: 'Kaedama',
    ja: '替え玉・和え玉',
    description: 'Refill noodles and seasoned garlic or egg aedama.',
  },
  Ippin: {
    en: 'Small Plates & Oden',
    ja: '発酵一品・味噌おでん',
    description: 'Fermented vegetable plates, miso oden, pickles, and karaage.',
  },
  Beer: {
    en: 'Craft Beer',
    ja: '箕面ビール・オリゼー',
    description: 'Minoh Beer on tap and bottled, plus gluten-free Orizé rice-koji ales.',
  },
  JapaneseSake: {
    en: 'Akishika Sake',
    ja: '能勢・秋鹿の純米酒',
    description: 'Brewed in Nose Town, Osaka from organic self-grown Yamada Nishiki rice.',
  },
  LunchSpecial: {
    en: 'Lunch Sets',
    ja: '昼のお膳 (11:30–14:30)',
    description: 'Fermentation Gozen, Karaage Gozen, and Kids Ramen.',
  },
  SunsetSpecial: {
    en: 'Sunset Sets',
    ja: '夕方のセット (14:30–17:30)',
    description: 'Afternoon fermented vegetable plates and coffee sets.',
  },
  DinnerSpecial: {
    en: 'Dinner Sets',
    ja: '夜のセット (17:30–22:00)',
    description: 'Side plate, karaage, or rice sets to pair with any bowl.',
  },
  Wine: {
    en: 'Japanese Wine',
    ja: '日本ワイン',
    description: 'Koshu varietals and 1.8L bottle pours.',
  },
  SoftDrink: {
    en: 'Sodas & Coffee',
    ja: '豊能サイダー・自家製ソーダ・珈琲',
    description: 'Local Toyono cider, house fermented syrup soda, and roasted coffee.',
  },
  Dessert: {
    en: 'Sweets',
    ja: '甘味',
    description: 'Nostalgic icecrine and rich cheesecake.',
  },
};

const TIME_SLOTS: { id: TimeSlot; label: string; hours: string }[] = [
  { id: 'Lunch', label: 'Lunch', hours: '11:30–14:30' },
  { id: 'Sunset', label: 'Sunset', hours: '14:30–17:30' },
  { id: 'Dinner', label: 'Dinner', hours: '17:30–22:00' },
  { id: 'Midnight', label: 'Midnight', hours: '22:00–23:30' },
];

const DIETARY_FILTERS: { id: DietaryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'plant-based', label: 'Vegan / Veg' },
  { id: 'no-pork', label: 'No Pork' },
  { id: 'spicy', label: 'Spicy' },
];

interface MenuClientProps {
  initialItems: MenuItem[];
}

export default function MenuClient({ initialItems }: MenuClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Ramen');
  const [activeTime, setActiveTime] = useState<TimeSlot>('Dinner');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slotParam = params.get('slot') as TimeSlot | null;
    if (slotParam && ['Lunch', 'Sunset', 'Dinner', 'Midnight'].includes(slotParam)) {
      setActiveTime(slotParam);
    } else {
      setActiveTime(getDefaultTimeSlot(new Date()));
    }
  }, []);

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
        // Keep SSR initialItems fallback
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedItem]);

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

  const scrollToCategory = (category: MenuCategory) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(category);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Compact Header */}
      <header className="px-4 sm:px-6 pt-6 pb-4 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            お品書き <span className="text-lg sm:text-xl font-normal text-muted ml-1">Menu</span>
          </h1>
          <span className="text-[11px] text-muted font-tabular">Tax included</span>
        </div>

        {/* Time Slot Selector — compact horizontal pills */}
        <div
          role="tablist"
          aria-label="Service time"
          className="flex overflow-x-auto no-scrollbar gap-1.5 mt-4 -mx-4 px-4 sm:mx-0 sm:px-0"
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
                className={`flex-none min-h-[38px] px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                  active
                    ? 'bg-foreground text-surface font-medium'
                    : 'bg-surface-muted text-foreground-soft hover:text-foreground'
                }`}
              >
                <span>{slot.label}</span>
                <span className={`ml-1.5 font-tabular text-[11px] ${active ? 'text-surface/75' : 'text-muted'}`}>
                  {slot.hours}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dietary filter pills */}
        <div
          role="group"
          aria-label="Dietary filter"
          className="flex items-center overflow-x-auto no-scrollbar gap-1.5 mt-2.5 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {DIETARY_FILTERS.map((f) => {
            const active = dietaryFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setDietaryFilter(f.id)}
                className={`flex-none min-h-[30px] px-2.5 py-1 text-[11px] transition-colors ${
                  active
                    ? 'text-urushi font-semibold underline decoration-urushi underline-offset-4'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Slim Sticky Category Strip */}
      {availableCategories.length > 0 && (
        <nav
          aria-label="Menu categories"
          className="sticky top-14 z-30 bg-surface/95 backdrop-blur-md border-y border-[color:var(--color-border)]"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-4">
            {availableCategories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => scrollToCategory(cat)}
                  className={`flex-none py-2.5 text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'border-foreground text-foreground font-semibold'
                      : 'border-transparent text-muted hover:text-foreground'
                  }`}
                >
                  {CATEGORY_LABELS[cat].en}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Horizontal Swipe Rails per Category */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {availableCategories.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="font-serif text-xl text-foreground">
              No dishes match this filter in {activeTime}.
            </p>
            <p className="text-xs text-muted">
              Vegan Tantanmen and our full ramen lineup are served during Dinner (17:30–22:00).
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDietaryFilter('all')}
                className="min-h-[40px] px-4 py-2 bg-foreground text-surface text-xs rounded-full"
              >
                Show All {activeTime} Dishes
              </button>
              {activeTime !== 'Dinner' && (
                <button
                  type="button"
                  onClick={() => setActiveTime('Dinner')}
                  className="min-h-[40px] px-4 py-2 border border-[color:var(--color-border-strong)] text-foreground text-xs rounded-full"
                >
                  Switch to Dinner
                </button>
              )}
            </div>
          </div>
        ) : (
          availableCategories.map((cat) => {
            const items = grouped[cat];
            const meta = CATEGORY_LABELS[cat];
            return (
              <section
                key={cat}
                id={`category-${cat}`}
                aria-labelledby={`heading-${cat}`}
                className="scroll-mt-28"
              >
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <div className="flex items-baseline gap-2.5">
                    <h2
                      id={`heading-${cat}`}
                      className="font-serif text-xl sm:text-2xl font-bold text-foreground"
                    >
                      {meta.en}
                    </h2>
                    <span className="text-xs text-muted" translate="no">
                      {meta.ja}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted font-tabular">
                    {items.length}
                  </span>
                </div>

                {/* Horizontal Snap Rail */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 no-scrollbar">
                  {items.map((item) => {
                    const priceSummary = getPriceSummary(item.priceYen);
                    const tags = (item.dietary ?? []).map((t) => t.toLowerCase());
                    const isVegan = tags.includes('vegan') || tags.includes('ビーガン');
                    const isVeg = !isVegan && (tags.includes('vegetarian') || tags.includes('ベジタリアン'));
                    const isSpicy = tags.includes('spicy');

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex-none w-[160px] sm:w-[200px] snap-start text-left group"
                      >
                        <DishMediaFrame
                          src={item.imageUrl}
                          alt={item.name}
                          category={item.category}
                          itemName={item.name}
                          aspectClassName="aspect-square"
                        />

                        <div className="pt-2 pr-1">
                          <div className="flex items-baseline justify-between gap-1.5">
                            <h3 className="font-serif text-sm sm:text-base font-medium text-foreground leading-snug line-clamp-2 group-hover:text-urushi transition-colors">
                              {item.name}
                            </h3>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-tabular text-xs text-foreground-soft">
                              {priceSummary}
                            </span>
                            {isVegan && (
                              <span className="text-[10px] font-medium text-koji">Vegan</span>
                            )}
                            {isVeg && (
                              <span className="text-[10px] font-medium text-koji">Veg</span>
                            )}
                            {isSpicy && (
                              <span className="text-[10px] font-medium text-urushi">Spicy</span>
                            )}
                          </div>
                          {/* Hidden full description in DOM for SEO & screen readers, visible on tap in drawer */}
                          <span className="sr-only">{item.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Bottom Sheet (Mobile) / Modal (Desktop) for Dish Details */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-50 bg-kasshoku-deep/60"
              aria-hidden="true"
            />
            <motion.div
              key="sheet-panel"
              role="dialog"
              aria-modal="true"
              aria-label={selectedItem.name}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50 bg-surface max-h-[86vh] overflow-y-auto overscroll-contain border-t sm:border border-[color:var(--color-border-strong)]"
            >
              {/* Photo if available */}
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
                    aria-label="Close dish details"
                    className="absolute top-3 right-3 min-w-[40px] min-h-[40px] px-3 bg-kasshoku-deep/80 text-washi text-xs rounded-full"
                  >
                    Close
                  </button>
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-4">
                {!hasMenuImage(selectedItem.imageUrl) && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      aria-label="Close dish details"
                      className="text-xs uppercase tracking-wider text-muted hover:text-foreground py-1"
                    >
                      Close
                    </button>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted">
                    {CATEGORY_LABELS[selectedItem.category]?.ja} · {CATEGORY_LABELS[selectedItem.category]?.en}
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">
                    {selectedItem.name}
                  </h2>
                </div>

                {/* Prices */}
                <div className="border-y border-[color:var(--color-border)] py-3 space-y-1.5 text-sm">
                  {getPriceEntries(selectedItem.priceYen).map((entry) => (
                    <div key={entry.label} className="flex justify-between">
                      <span className="text-foreground-soft capitalize">{entry.label}</span>
                      <span className="font-tabular font-semibold text-foreground">{entry.formatted}</span>
                    </div>
                  ))}
                </div>

                {selectedItem.description && (
                  <p className="text-sm text-foreground-soft leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}

                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <p className="text-xs text-muted">
                    Ingredients: {selectedItem.ingredients.join(', ')}
                  </p>
                )}

                {((selectedItem.dietary && selectedItem.dietary.length > 0) ||
                  (selectedItem.allergies && selectedItem.allergies.length > 0)) && (
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {selectedItem.dietary?.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-0.5 bg-surface-muted text-foreground-soft rounded-full"
                      >
                        {d}
                      </span>
                    ))}
                    {selectedItem.allergies && selectedItem.allergies.length > 0 && (
                      <span className="px-2.5 py-0.5 bg-urushi/10 text-urushi rounded-full">
                        Allergens: {selectedItem.allergies.join(', ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
