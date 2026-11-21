'use client';

import type { MenuItem, MenuCategory, TimeSlot } from '@/domain/types';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { MenuFilterBar } from '@/components/menu/MenuFilterBar';
import { MenuJsonLd } from '@/components/seo/MenuJsonLd';

export const CATEGORY_LABELS: Record<
  MenuCategory,
  { en: string; ja: string; description: string }
> = {
  Ramen: {
    en: 'Ramen',
    ja: 'ラーメン',
    description: 'Traditional Japanese noodle soup with various broths and toppings',
  },
  Kaedama: {
    en: 'Kaedama',
    ja: '替え玉',
    description: 'Refill noodles to enjoy more with your remaining soup. Seasoned options available.',
  },
  Beer: {
    en: 'Beer',
    ja: 'ビール',
    description: 'Selection of Japanese and craft beers',
  },
  JapaneseSake: {
    en: 'Japanese Sake',
    ja: '日本酒',
    description:
      "Akishika Shuzō's sake brewed in Nose Town, Osaka. Robust, expressive sake with rich umami and vibrant acidity. Perfect pairing with ramen and Japanese side dishes.",
  },
  Wine: {
    en: 'Wine',
    ja: 'ワイン',
    description:
      'Curated selection of Japanese wines, including rare Koshu varietal bottles and house pour by the glass.',
  },
  SoftDrink: {
    en: 'Soft Drinks',
    ja: 'ソフトドリンク',
    description:
      'Non-alcoholic beverages including local Toyono cider, seasonal soda, house-roasted coffee, and more.',
  },
  Dessert: {
    en: 'Dessert',
    ja: 'デザート',
    description:
      'Sweet endings — from nostalgic icecrine to rich cheesecake paired with house-roasted coffee.',
  },
  Ippin: {
    en: 'Side Dishes',
    ja: '一品料理',
    description:
      "Seasonal and fermented side dishes, including chef's selection, oden, and more. Perfect with drinks or ramen.",
  },
  LunchSpecial: {
    en: 'Lunch Special',
    ja: 'ランチスペシャル',
    description:
      'Limited-time lunch specials, including the fermentation gozen set, kids set, and more.',
  },
  SunsetSpecial: {
    en: 'Sunset Special',
    ja: 'サンセットスペシャル',
    description:
      'Relaxed afternoon bites and sets, available during the golden hours of 14:30–17:30.',
  },
  DinnerSpecial: {
    en: 'Dinner Special',
    ja: 'ディナースペシャル',
    description:
      'Evening side sets to complement your ramen — choose from small plates, karaage, or rice options.',
  },
};

function getDefaultTimeSlot(): TimeSlot {
  const now = new Date();
  const day = now.getDay();
  const time = now.getHours() * 60 + now.getMinutes();
  if ([3, 4, 5, 6].includes(day) && time >= 1320 && time < 1410) return 'Midnight';
  if (time >= 1050 && time < 1320) return 'Dinner';
  if (time >= 870 && time < 1050) return 'Sunset';
  if (time >= 690 && time < 870) return 'Lunch';
  return 'Dinner';
}

export default function MenuClient({
  initialItems = [],
}: {
  initialItems?: MenuItem[];
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState<string | null>('Ramen');
  const [activeTime, setActiveTime] = useState<TimeSlot>(getDefaultTimeSlot());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTime(getDefaultTimeSlot());
  }, []);

  // Fetch menu from API (which tries DB for latest edits/sortOrder, falls back to JSON files)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error('Failed to fetch menu');
        const data = await res.json();
        if (mounted && Array.isArray(data)) setMenuItems(data as MenuItem[]);
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredMenuItems = menuItems.filter((item) =>
    item.availableAt ? item.availableAt.includes(activeTime) : activeTime === 'Dinner'
  );

  const grouped = filteredMenuItems.reduce(
    (acc: Record<string, MenuItem[]>, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const availableCategories = (Object.keys(CATEGORY_LABELS) as MenuCategory[]).filter(
    (cat) => (grouped[cat]?.length ?? 0) > 0
  );

  const scrollToCategory = (category: MenuCategory) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(category);
    }
  };

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      {/* JSON-LD はクライアント側で initialItems から描画する。サーバーコンポーネントで出すと
          RSC ペイロードにも同じ JSON が複製され、/menu の HTML が膨らむ（Worker の CPU 時間対策）。
          ハイドレーションの不一致を避けるため、取得後の menuItems ではなく initialItems を使う。 */}
      <MenuJsonLd items={initialItems} />
      <div className="min-h-screen bg-background">
        <DecorativeBackground />

        <ImageLightbox
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />

        <header className="relative z-10 pt-24 pb-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] tracking-[0.5em] text-kohaku uppercase mb-4 font-light">
                Mitsukabose
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl font-light text-foreground mb-4 tracking-wide"
            >
              Menu
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="w-10 h-px bg-kasshoku/25" />
              <p className="text-base text-foreground-soft font-light">
                <span className="font-serif tracking-[0.3em]">お品書き</span>
                <span className="mx-3 text-muted/50">·</span>
                <span className="text-sm">Fermented Miso Ramen &amp; Craft Beer</span>
              </p>
              <div className="w-10 h-px bg-kasshoku/25" />
            </motion.div>
          </div>
        </header>

        <MenuFilterBar
          activeTime={activeTime}
          onSelectTime={setActiveTime}
          categories={availableCategories}
          categoryLabels={CATEGORY_LABELS}
          activeCategory={activeCategory}
          onSelectCategory={scrollToCategory}
        />

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          {availableCategories.map((cat) => (
            <section id={`category-${cat}`} key={cat} className="mb-28 scroll-mt-32">
              {/* Category header */}
              <div className="mb-10 flex items-center gap-6">
                <div className="flex-1 h-px bg-kasshoku/15" />
                <div className="text-center">
                  <p className="text-[10px] tracking-[0.4em] text-kohaku uppercase mb-1">
                    {CATEGORY_LABELS[cat].ja}
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-wide">
                    {CATEGORY_LABELS[cat].en}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-kasshoku/15" />
              </div>
              <p className="text-center text-foreground-soft font-light text-sm max-w-lg mx-auto mb-10 leading-relaxed">
                {CATEGORY_LABELS[cat].description}
              </p>

              <div className="flex overflow-x-auto pb-6 gap-5 snap-x snap-mandatory">
                {grouped[cat].map((item, itemIndex) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    index={itemIndex}
                    onSelectImage={(url) => setSelectedImage(url)}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </TooltipProvider>
  );
}
