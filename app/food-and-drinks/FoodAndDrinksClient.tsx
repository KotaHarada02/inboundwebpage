'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getFoodDrinks } from '@/domain/services/dataService';
import type { FoodDrinkItem } from '@/domain/types';
import { DishMediaFrame } from '@/components/ui/DishMediaFrame';
import { X, MapPin } from 'lucide-react';

type SectionKey = 'minoh' | 'orize' | 'sake' | 'food';

const PRODUCER_PROFILES: Record<
  SectionKey,
  {
    title: string;
    ja: string;
    origin: string;
    founded: string;
    heroImage: string;
    heroAlt: string;
    pairingNote: string;
    intro: string;
  }
> = {
  minoh: {
    title: 'Minoh Beer',
    ja: '箕面ビール',
    origin: 'Minoh City, Northern Osaka (15 min from Hotarugaike)',
    founded: 'Founded 1997',
    heroImage: '/images/food-and-drinks/minoh.jpg',
    heroAlt: 'Freshly poured pint of Minoh craft beer with bottles of Stout and W-IPA on a wooden table',
    pairingNote: 'Best paired with: Red Miso Ramen, Spicy Miso Ramen & House Karaage',
    intro:
      'Established in 1997 at the foot of the cedar-covered Minoh mountains in northern Osaka, Minoh Beer is a family-run craft brewery led by the Ohshita sisters. Their unfiltered, live-yeast ales have won World Beer Awards for their balance of roasted malt depth and clean drinkability.',
  },
  orize: {
    title: 'Orizé Brewing',
    ja: 'オリゼーブルーイング',
    origin: 'Wakayama, Kansai',
    founded: 'Founded 2019',
    heroImage: '/images/food-and-drinks/orize-brewing.png',
    heroAlt: 'The storefront and fermentation tanks of Orizé Brewing',
    pairingNote: 'Best paired with: TOYONO Ramen, Vegan Tantanmen & Fermented Vegetable Plates',
    intro:
      'Named after Aspergillus oryzae (the national koji mold of Japan), Orizé Brewing is the world’s first craft brewery to ferment beer using Japanese rice koji instead of barley malt. Naturally gluten-free, aromatic, and gentle on the palate.',
  },
  sake: {
    title: 'Akishika Sake Brewery',
    ja: '秋鹿酒造',
    origin: 'Nose Town, Northern Osaka',
    founded: 'Founded 1886',
    heroImage: '/images/food-and-drinks/akishika-sake.jpg',
    heroAlt: 'Bottles of Akishika sake from Nose Town served in a glass cup',
    pairingNote: 'Best paired with: White Miso Ramen, Miso Oden & Sake Kasu Dishes',
    intro:
      'High in the mountain valleys of Nose Town at the northern tip of Osaka, Akishika Shuzō practices Ikkan-zukuri—growing its own pesticide-free Yamada Nishiki rice and brewing pure junmai sake in-house. Its vibrant lactic acidity and savory umami cut cleanly through rich miso broth.',
  },
  food: {
    title: 'Mitsukabose Miso Ramen',
    ja: 'みつか坊主の味噌ラーメン',
    origin: 'Hotarugaike, Toyonaka, Osaka',
    founded: 'Brewed daily in-house',
    heroImage: '/images/food-and-drinks/mitsukabose-food.jpg',
    heroAlt: 'The 2nd-floor dining hall at Mitsukabose in Hotarugaike',
    pairingNote: 'Served across Lunch, Sunset, Dinner & Wed–Sat Midnight',
    intro:
      'Every bowl starts with regional Japanese misos—from sweet, silky Kyoto-style white miso and aged red miso blends to handcrafted Kaachan Miso from neighboring Toyono Town and Akishika sake lees.',
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
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ src: string; alt: string } | null>(null);

  const minohRef = useRef<HTMLElement>(null);
  const orizeRef = useRef<HTMLElement>(null);
  const sakeRef = useRef<HTMLElement>(null);
  const foodRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enlargedPhoto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlargedPhoto(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enlargedPhoto]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      const sections: { ref: React.RefObject<HTMLElement | null>; tab: SectionKey }[] = [
        { ref: minohRef, tab: 'minoh' },
        { ref: orizeRef, tab: 'orize' },
        { ref: sakeRef, tab: 'sake' },
        { ref: foodRef, tab: 'food' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.ref.current && s.ref.current.offsetTop <= scrollPosition) {
          setActiveTab(s.tab);
          return;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: SectionKey) => {
    const refs = { minoh: minohRef, orize: orizeRef, sake: sakeRef, food: foodRef };
    const element = refs[section].current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(section);
    }
  };

  return (
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

      {/* Editorial Header */}
      <header className="border-b border-[color:var(--color-border-strong)] bg-surface pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Osaka Craft Beer, Nose Natural Sake &amp; Fermented Miso Bowls
            </h1>
            <p className="text-base sm:text-lg text-foreground-soft measure-prose leading-relaxed">
              We partner directly with three independent Kansai breweries—Minoh Beer, Orizé
              Brewing, and Akishika Sake Brewery—so every glass poured at our table shares the
              same fermentation roots as our miso broth.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center min-h-[46px] px-6 py-2.5 bg-urushi hover:bg-urushi-deep text-washi text-sm font-medium rounded-xs transition-colors"
            >
              See Prices &amp; Time Slots in Menu
            </Link>
          </div>
        </div>
      </header>

      {/* Sticky Producer Navigation */}
      <nav
        aria-label="Producer sections"
        className="sticky top-16 z-30 bg-surface-elevated border-b border-[color:var(--color-border-strong)] shadow-[var(--shadow-ledger)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center overflow-x-auto no-scrollbar gap-2">
          {(
            [
              { id: 'minoh', label: 'Minoh Beer', ja: '箕面ビール', count: minohBeers.length },
              { id: 'orize', label: 'Orizé Rice-Koji Beer', ja: 'オリゼー', count: orizeBeers.length },
              { id: 'sake', label: 'Akishika Sake', ja: '秋鹿酒造', count: sakes.length },
              { id: 'food', label: 'Miso Ramen Lineup', ja: '味噌ラーメン', count: foods.length },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`inline-flex items-baseline gap-2 min-h-[42px] px-4 py-2 rounded-xs text-xs sm:text-sm font-medium whitespace-nowrap border transition-colors ${
                  active
                    ? 'bg-kasshoku-deep text-washi border-kasshoku-deep'
                    : 'bg-surface text-foreground-soft border-[color:var(--color-border-strong)] hover:text-foreground hover:bg-surface-muted'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] ${active ? 'text-kohaku-soft' : 'text-muted'}`}
                  translate="no"
                >
                  {tab.ja}
                </span>
                <span
                  className={`font-tabular text-[11px] ${
                    active ? 'text-washi/80' : 'text-muted'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Producer Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-24">
        <ProducerSection
          sectionRef={minohRef}
          id="minoh"
          profile={PRODUCER_PROFILES.minoh}
          items={minohBeers}
          onSelectImage={(src, alt) => setEnlargedPhoto({ src, alt })}
        />

        <ProducerSection
          sectionRef={orizeRef}
          id="orize"
          profile={PRODUCER_PROFILES.orize}
          items={orizeBeers}
          onSelectImage={(src, alt) => setEnlargedPhoto({ src, alt })}
        />

        <ProducerSection
          sectionRef={sakeRef}
          id="sake"
          profile={PRODUCER_PROFILES.sake}
          items={sakes}
          onSelectImage={(src, alt) => setEnlargedPhoto({ src, alt })}
        />

        <ProducerSection
          sectionRef={foodRef}
          id="food"
          profile={PRODUCER_PROFILES.food}
          items={foods}
          onSelectImage={(src, alt) => setEnlargedPhoto({ src, alt })}
        />

        {/* Bottom CTA */}
        <section className="ledger-frame bg-kasshoku-deep text-washi p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-washi">
              Check What Is Pouring &amp; Simmering Today
            </h2>
            <p className="text-sm sm:text-base text-washi/80 leading-relaxed">
              See full prices, serving sizes (glass, pint, carafe, or 180ml sake pour), and
              dietary notes on our Menu Ledger.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 bg-urushi hover:bg-urushi-deep text-washi text-sm font-medium rounded-xs transition-colors"
            >
              Open Full Menu Ledger
            </Link>
            <Link
              href="/access"
              className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 bg-transparent hover:bg-washi/10 text-washi border border-washi/30 text-sm font-medium rounded-xs transition-colors"
            >
              1-Min Walk from Hotarugaike Stn
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProducerSection({
  sectionRef,
  id,
  profile,
  items,
  onSelectImage,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  id: SectionKey;
  profile: (typeof PRODUCER_PROFILES)[SectionKey];
  items: FoodDrinkItem[];
  onSelectImage: (src: string, alt: string) => void;
}) {
  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`producer-${id}`}
      className="scroll-mt-36 space-y-10"
    >
      {/* Producer Overview Card */}
      <div className="ledger-frame overflow-hidden bg-surface-elevated grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto min-h-[260px] bg-surface-muted border-b lg:border-b-0 lg:border-r border-[color:var(--color-border)]">
          <Image
            src={profile.heroImage}
            alt={profile.heroAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-soft">
              <span className="inline-flex items-center gap-1 font-medium text-urushi">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {profile.origin}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-tabular text-muted">{profile.founded}</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2
                id={`producer-${id}`}
                className="font-serif text-2xl sm:text-3xl font-bold text-foreground"
              >
                {profile.title}
              </h2>
              <span className="font-serif text-base text-foreground-soft" translate="no">
                {profile.ja}
              </span>
            </div>

            <p className="text-sm sm:text-base text-foreground-soft leading-relaxed measure-prose">
              {profile.intro}
            </p>
          </div>

          <div className="pt-3 border-t border-[color:var(--color-border)] text-xs font-medium text-foreground">
            {profile.pairingNote}
          </div>
        </div>
      </div>

      {/* Lineup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="ledger-frame overflow-hidden flex flex-col bg-surface-elevated"
          >
            <DishMediaFrame
              src={item.imageUrl}
              alt={item.name}
              category={item.category}
              itemName={item.name}
              onSelectImage={onSelectImage}
            />
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
                  {item.name}
                </h3>
                <p className="text-sm text-foreground-soft mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
