'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TimeSlot } from '@/domain/types';
import { getDefaultTimeSlot, formatYen } from '@/lib/menuUtils';

interface HeroSectionProps {
  images?: string[];
}

interface SlotDish {
  id: string;
  name: string;
  ja: string;
  price: number;
  image: string;
  tag?: string;
}

const SLOT_DISHES: Record<TimeSlot, { hours: string; dishes: SlotDish[] }> = {
  Lunch: {
    hours: '11:30–14:30',
    dishes: [
      {
        id: 'white-miso',
        name: 'White Miso Ramen',
        ja: '白味噌ラーメン',
        price: 1080,
        image: '/images/menu/white-miso.jpg',
        tag: 'Signature',
      },
      {
        id: 'fermentation-gozen',
        name: 'Fermentation Gozen',
        ja: '発酵御膳',
        price: 1760,
        image: '/images/menu/fermentation-gozen.jpg',
        tag: 'Lunch Set',
      },
      {
        id: 'vegi-miso',
        name: 'Vege Miso Ramen',
        ja: 'ベジ味噌ラーメン',
        price: 1180,
        image: '/images/menu/vegi-miso.jpg',
        tag: 'Vegetarian',
      },
      {
        id: 'tsukemen-ver8',
        name: 'Miso Tsukemen No.8',
        ja: '味噌つけ麺',
        price: 1250,
        image: '/images/menu/tsukemen-ver8.jpg',
      },
      {
        id: 'draft-regular',
        name: 'Minoh Beer Draft',
        ja: '箕面ビール樽生',
        price: 850,
        image: '/images/menu/draft-regular.jpg',
      },
    ],
  },
  Sunset: {
    hours: '14:30–17:30',
    dishes: [
      {
        id: 'white-miso',
        name: 'White Miso Ramen',
        ja: '白味噌ラーメン',
        price: 1080,
        image: '/images/menu/white-miso.jpg',
        tag: 'All-Day',
      },
      {
        id: 'tsukemen-ver8',
        name: 'Miso Tsukemen No.8',
        ja: '味噌つけ麺',
        price: 1250,
        image: '/images/menu/tsukemen-ver8.jpg',
      },
      {
        id: 'akishika-tasting',
        name: 'Akishika Sake Flight',
        ja: '秋鹿 飲み比べ',
        price: 1320,
        image: '/images/menu/akishika-tasting.jpg',
      },
      {
        id: 'ippin-5',
        name: '5 Fermented Plates',
        ja: '発酵あて五種盛り',
        price: 1320,
        image: '/images/menu/ippin-5.jpg',
      },
      {
        id: 'osaru-ipa',
        name: 'Minoh Osaru IPA',
        ja: 'おさるIPA',
        price: 900,
        image: '/images/menu/osaru-ipa.jpg',
      },
    ],
  },
  Dinner: {
    hours: '17:30–22:00',
    dishes: [
      {
        id: 'white-miso',
        name: 'White Miso Ramen',
        ja: '白味噌ラーメン',
        price: 1080,
        image: '/images/menu/white-miso.jpg',
        tag: 'Signature',
      },
      {
        id: 'vegan-tantanmen',
        name: 'Vegan Tantanmen',
        ja: 'ヴィーガン担々麺',
        price: 1350,
        image: '/images/menu/vegan-tantanmen.jpg',
        tag: 'Vegan',
      },
      {
        id: 'red-miso',
        name: 'Red Miso Ramen',
        ja: '赤味噌ラーメン',
        price: 1080,
        image: '/images/menu/red-miso.jpg',
      },
      {
        id: 'spicy-miso',
        name: 'Spicy Miso Ramen',
        ja: '辛味噌ラーメン',
        price: 1180,
        image: '/images/menu/spicy-miso.jpg',
        tag: 'Spicy',
      },
      {
        id: 'toyono-ramen',
        name: 'TOYONO Clam Miso',
        ja: 'とよのラーメン',
        price: 1340,
        image: '/images/menu/toyono-ramen.jpg',
      },
      {
        id: 'oden-7',
        name: 'Miso Oden (7 pcs)',
        ja: '味噌おでん七種',
        price: 1320,
        image: '/images/menu/oden-7.jpg',
      },
    ],
  },
  Midnight: {
    hours: '22:00–23:30 (Wed–Sat)',
    dishes: [
      {
        id: 'midnight-white-miso',
        name: 'Midnight White Miso',
        ja: '深夜の白味噌',
        price: 1200,
        image: '/images/menu/midnight-white-miso.jpg',
        tag: 'Wed–Sat',
      },
      {
        id: 'midnight-red-miso',
        name: 'Midnight Red Miso',
        ja: '深夜の赤味噌',
        price: 1200,
        image: '/images/menu/midnight-red-miso.jpg',
      },
      {
        id: 'toyono-ramen',
        name: 'TOYONO Ramen',
        ja: 'とよのラーメン',
        price: 1100,
        image: '/images/menu/toyono-ramen.jpg',
      },
      {
        id: 'orize-malt-pale-ale',
        name: 'Orizé Rice-Koji Ale',
        ja: 'オリゼー米麹エール',
        price: 990,
        image: '/images/menu/orize-malt-pale-ale.jpg',
        tag: 'Gluten-Free',
      },
    ],
  },
};

const HERO_SLIDES = [
  {
    src: '/images/hero/0303_1N0A1489.jpg',
    alt: 'Guests enjoying miso ramen at Mitsukabose in front of the 2nd-floor arched window overlooking the Osaka Monorail',
    caption: '2F Hotarugaike Dining Hall',
  },
  {
    src: '/images/menu/white-miso.jpg',
    alt: 'Mitsukabose signature White Miso Ramen with chashu, chicken meatballs, and green onions',
    caption: 'Signature White Miso Ramen',
  },
  {
    src: '/images/hero/0138_1N0A1102.jpg',
    alt: 'Pouring Minoh craft beer from the draft tap into a monkey pint glass',
    caption: 'Minoh Craft Beer on Tap',
  },
  {
    src: '/images/hero/0054_1N0A0937.jpg',
    alt: 'Mitsukabose chef holding five fermented small plates in front of the open kitchen',
    caption: 'Seasonal Fermented Small Plates',
  },
] as const;

export default function HeroSection({ images }: HeroSectionProps = {}) {
  void images;
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('Dinner');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setSelectedSlot(getDefaultTimeSlot(new Date()));
  }, []);

  const currentData = SLOT_DISHES[selectedSlot];

  return (
    <section aria-label="Mitsukabose introduction" className="bg-surface">
      {/* 1. Full-bleed Visual Hero */}
      <div className="relative w-full h-[64vh] min-h-[420px] max-h-[620px] bg-kasshoku-deep overflow-hidden">
        <Image
          src={HERO_SLIDES[activeSlide].src}
          alt={HERO_SLIDES[activeSlide].alt}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Minimal Photo Switcher Pills at Top-Right */}
        <div
          className="absolute top-4 right-4 z-10 flex gap-1.5"
          role="group"
          aria-label="Switch hero photograph"
        >
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`View photo: ${slide.caption}`}
              aria-pressed={activeSlide === idx}
              className={`min-w-[32px] min-h-[32px] px-2 text-[11px] font-tabular rounded-full transition-colors ${
                activeSlide === idx
                  ? 'bg-washi text-kasshoku-deep font-semibold'
                  : 'bg-black/45 text-washi/80 hover:bg-black/65'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        {/* Bottom-Aligned Editorial Typography */}
        <div className="absolute inset-x-0 bottom-0 z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8 text-washi">
          <p className="font-serif text-sm sm:text-base text-washi/85 mb-1" translate="no">
            人生に味噌とビールを。
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-[1.12] max-w-2xl">
            Fermented Miso Ramen, Craft Beer &amp; Sake.
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-washi/80">
            <span>Hotarugaike Stn East Exit 1 min</span>
            <span>·</span>
            <span>Itami Airport (ITM) 1 stop / 3 min</span>
            <span>·</span>
            <span>Walk-ins welcome</span>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Swipeable Menu Preview by Time Slot */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 border-b border-[color:var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Bowls &amp; Pours
            </h2>
            <span className="font-tabular text-xs text-muted">{currentData.hours}</span>
          </div>

          {/* Compact Time-Slot Pills */}
          <div
            role="tablist"
            aria-label="Select service time slot"
            className="flex overflow-x-auto no-scrollbar gap-1.5 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {(['Lunch', 'Sunset', 'Dinner', 'Midnight'] as TimeSlot[]).map((slot) => {
              const active = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex-none min-h-[36px] px-3.5 py-1 rounded-full text-xs transition-colors ${
                    active
                      ? 'bg-foreground text-surface font-medium'
                      : 'bg-surface-muted text-foreground-soft hover:text-foreground'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Snap Rail of Dishes */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 no-scrollbar">
          {currentData.dishes.map((dish) => (
            <Link
              key={dish.id}
              href={`/menu?slot=${selectedSlot}`}
              className="flex-none w-[160px] sm:w-[200px] snap-start group"
            >
              <div className="relative aspect-square w-full bg-surface-muted overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {dish.tag && (
                  <span className="absolute top-2 left-2 bg-kasshoku-deep/85 text-washi text-[10px] px-2 py-0.5">
                    {dish.tag}
                  </span>
                )}
              </div>
              <div className="pt-2">
                <h3 className="font-serif text-sm sm:text-base font-medium text-foreground leading-snug line-clamp-1 group-hover:text-urushi transition-colors">
                  {dish.name}
                </h3>
                <div className="flex items-baseline justify-between gap-2 mt-0.5">
                  <span className="text-[11px] text-muted truncate" translate="no">
                    {dish.ja}
                  </span>
                  <span className="font-tabular text-xs text-foreground-soft">
                    {formatYen(dish.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Final Card in Rail: Open Full Menu */}
          <Link
            href={`/menu?slot=${selectedSlot}`}
            className="flex-none w-[140px] sm:w-[170px] snap-start flex flex-col justify-between p-4 bg-surface-muted hover:bg-foreground hover:text-surface transition-colors aspect-square"
          >
            <span className="font-serif text-base font-medium leading-snug">
              See All {selectedSlot} Menu
            </span>
            <span className="text-xs font-tabular opacity-75">73 items</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
