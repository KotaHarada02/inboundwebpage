'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TimeSlot } from '@/domain/types';
import { getDefaultTimeSlot, formatYen } from '@/lib/menuUtils';
import { MapPin, Clock, Utensils, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  images?: string[];
}

interface SlotHighlight {
  name: string;
  ja: string;
  note: string;
  price: number;
  badge?: string;
}

const SLOT_DATA: Record<
  TimeSlot,
  {
    hours: string;
    summary: string;
    highlights: SlotHighlight[];
  }
> = {
  Lunch: {
    hours: '11:30–14:30 (Wed–Sun)',
    summary: 'Midday white-miso ramen, fermentation gozen sets, and daytime craft beer.',
    highlights: [
      {
        name: 'White Miso Ramen',
        ja: '白味噌ラーメン',
        note: 'Signature smooth white-miso & dashi broth',
        price: 1080,
        badge: 'Signature',
      },
      {
        name: 'Fermentation Gozen Set',
        ja: '発酵御膳',
        note: 'Ramen with seasonal fermented small plates & rice',
        price: 1760,
        badge: 'Lunch Set',
      },
      {
        name: 'Vege Miso Ramen',
        ja: 'ベジ味噌ラーメン',
        note: 'Vegetable-forward miso broth loaded with seasonal produce',
        price: 1180,
        badge: 'Vegetarian',
      },
      {
        name: 'Minoh Beer Draft (Regular)',
        ja: '箕面ビール 樽生',
        note: 'Freshly poured local Osaka craft beer',
        price: 850,
      },
    ],
  },
  Sunset: {
    hours: '14:30–17:30 (Wed–Sun)',
    summary: 'No afternoon closure — relaxed afternoon ramen, fermented bites & early pours.',
    highlights: [
      {
        name: 'White Miso Ramen',
        ja: '白味噌ラーメン',
        note: 'Served continuously through the afternoon',
        price: 1080,
        badge: 'All-Day Bowl',
      },
      {
        name: 'Miso Tsukemen No.8 (150g–300g)',
        ja: '味噌つけ麺 Ver.8',
        note: 'Rich dipping broth with thick house noodles',
        price: 1250,
      },
      {
        name: 'Sunset Fermented Veggie Plate',
        ja: 'サンセット発酵野菜プレート',
        note: 'Afternoon tasting plate paired with beer or sake',
        price: 980,
        badge: '14:30–17:30',
      },
      {
        name: 'Akishika Sake Tasting Flight',
        ja: '秋鹿 飲み比べ',
        note: 'Three expressions from Nose Town’s organic rice brewery',
        price: 1320,
      },
    ],
  },
  Dinner: {
    hours: '17:30–22:00 (Sun LO 21:30)',
    summary: 'Full lineup of 10+ miso ramen bowls, vegan tantanmen, oden, Akishika sake & craft beer.',
    highlights: [
      {
        name: 'White Miso Ramen',
        ja: '白味噌ラーメン',
        note: 'Our founding bowl with pork chashu & chicken tsukune',
        price: 1080,
        badge: 'Signature',
      },
      {
        name: 'Vegan Tantanmen',
        ja: 'ヴィーガン担々麺',
        note: 'Shiitake-kombu broth with soy milk, Toyono miso & Akishika sake lees',
        price: 1350,
        badge: '100% Vegan',
      },
      {
        name: 'Red Miso Ramen',
        ja: '赤味噌ラーメン',
        note: 'Deep, complex blend of aged red misos with medium-thick noodles',
        price: 1080,
      },
      {
        name: 'TOYONO Ramen (with Asari Clams)',
        ja: 'とよのラーメン（あさり）',
        note: 'Handcrafted Kaachan Miso from Toyono Town with clam umami',
        price: 1340,
      },
    ],
  },
  Midnight: {
    hours: '22:00–24:00 (Wed–Sat, LO 23:30)',
    summary: 'Late-night bowls and nightcap pours exclusively on Wednesday through Saturday nights.',
    highlights: [
      {
        name: 'Midnight White Miso Ramen',
        ja: '深夜の白味噌ラーメン',
        note: 'Late-night edition of our signature white miso bowl',
        price: 1200,
        badge: 'Wed–Sat Late',
      },
      {
        name: 'Midnight Red Miso Ramen',
        ja: '深夜の赤味噌ラーメン',
        note: 'Rich red miso broth after 22:00',
        price: 1200,
      },
      {
        name: 'TOYONO Ramen',
        ja: 'とよのラーメン',
        note: 'Toyono Town Kaachan Miso broth with roasted seaweed',
        price: 1100,
      },
      {
        name: 'Orizé Rice-Koji Craft Beer',
        ja: 'オリゼー 米麹クラフトビール',
        note: 'Gluten-free craft ale brewed with Japanese rice koji',
        price: 990,
        badge: 'Gluten-Free',
      },
    ],
  },
};

const HERO_GALLERY = [
  {
    src: '/images/menu/white-miso.jpg',
    title: 'Signature White Miso Ramen (白味噌ラーメン)',
    caption: 'Slow-brewed white miso and Japanese dashi in a vermilion bowl, topped with pork chashu, chicken tsukune, and sweet onions.',
    tag: 'Signature Bowl',
  },
  {
    src: '/images/hero/0303_1N0A1489.jpg',
    title: '2F Dining Hall Overlooking the Monorail',
    caption: 'Warm wooden tables, paper lanterns, and the arched steel window on the 2nd floor at Hotarugaike Station.',
    tag: '2F Dining Hall',
  },
  {
    src: '/images/hero/0138_1N0A1102.jpg',
    title: 'Minoh Beer & Orizé on Tap',
    caption: 'Freshly poured Osaka craft beer from Minoh Brewery and rice-koji ales from Orizé Brewing.',
    tag: 'Osaka Craft Beer',
  },
  {
    src: '/images/hero/0054_1N0A0937.jpg',
    title: 'Fermented Small Plates & Open Kitchen',
    caption: 'Five seasonal fermented small dishes served from our open kitchen alongside Akishika natural sake.',
    tag: 'Fermented Plates',
  },
] as const;

export default function HeroSection({ images }: HeroSectionProps = {}) {
  void images;
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('Dinner');
  const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const detected = getDefaultTimeSlot(new Date());
    setSelectedSlot(detected);
    setCurrentSlot(detected);
  }, []);

  const slotInfo = SLOT_DATA[selectedSlot];
  const activePhoto = HERO_GALLERY[activePhotoIndex];

  return (
    <section
      aria-label="Mitsukabose overview and live service menu"
      className="border-b border-[color:var(--color-border-strong)] bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column (7 cols): Clear offer, facts, and interactive Time-Slot Menu Ledger */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2 text-xs font-medium text-foreground-soft bg-surface-muted px-3 py-1.5 rounded-xs border border-[color:var(--color-border)]">
                <MapPin className="w-3.5 h-3.5 text-urushi flex-none" aria-hidden="true" />
                <span>Hotarugaike Station East Exit 1-min walk</span>
                <span aria-hidden="true">·</span>
                <span>1 stop (3 min) from Osaka Itami Airport (ITM)</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] font-bold text-foreground leading-[1.14] tracking-tight">
                Slow-Brewed White-Miso Ramen, Osaka Craft Beer &amp; Natural Sake.
              </h1>

              <p className="text-base sm:text-lg text-foreground-soft measure-prose leading-relaxed">
                Step up to the 2nd floor at Hotarugaike Station. At{' '}
                <strong className="font-medium text-foreground" translate="no">
                  Mitsukabose (発酵と味噌と麺 みつか坊主)
                </strong>
                , we brew our broths with handcrafted regional misos, pour unfiltered Minoh Beer
                and Akishika organic sake, and welcome every guest—from solo travelers with
                luggage to vegan diners and families.
              </p>

              {/* Key visitor facts at a glance */}
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs sm:text-sm text-foreground">
                <li className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-xs border border-[color:var(--color-border)]">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none" aria-hidden="true" />
                  <span>Walk-ins only (No reservation needed)</span>
                </li>
                <li className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-xs border border-[color:var(--color-border)]">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none" aria-hidden="true" />
                  <span>Vegan &amp; Pork-free bowls available</span>
                </li>
                <li className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-xs border border-[color:var(--color-border)]">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none" aria-hidden="true" />
                  <span>Open continuously 11:30–Night</span>
                </li>
              </ul>
            </div>

            {/* Primary CTAs — pure Links, no nested buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 bg-urushi hover:bg-urushi-deep text-washi text-sm font-medium rounded-xs transition-colors"
              >
                Explore Full Menu (73 Items)
              </Link>
              <Link
                href="/access"
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-surface-elevated hover:bg-surface-muted text-foreground border border-[color:var(--color-border-strong)] text-sm font-medium rounded-xs transition-colors"
              >
                1-Minute Station Route &amp; 2F Entrance
              </Link>
              <Link
                href="/food-and-drinks"
                className="inline-flex items-center justify-center min-h-[48px] px-5 py-3 text-foreground-soft hover:text-urushi text-sm font-medium underline underline-offset-4 transition-colors"
              >
                Meet Our Osaka Producers
              </Link>
            </div>

            {/* Interactive Service Ledger right in the first viewport */}
            <div className="ledger-frame overflow-hidden">
              <div className="bg-kasshoku-deep text-washi px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-kohaku-soft flex-none" aria-hidden="true" />
                  <h2 className="font-serif text-base font-medium text-washi">
                    What We Serve by Time of Day
                  </h2>
                </div>
                <span className="font-tabular text-xs text-kohaku-soft flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {slotInfo.hours}
                </span>
              </div>

              {/* Time slot switcher tabs (44px min height) */}
              <div
                role="tablist"
                aria-label="Service time slots"
                className="grid grid-cols-2 sm:grid-cols-4 border-b border-[color:var(--color-border-strong)] bg-surface-muted"
              >
                {(['Lunch', 'Sunset', 'Dinner', 'Midnight'] as TimeSlot[]).map((slot) => {
                  const active = selectedSlot === slot;
                  const isCurrent = currentSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedSlot(slot)}
                      className={`min-h-[46px] px-3 py-2 text-left sm:text-center border-r last:border-r-0 border-[color:var(--color-border)] transition-colors ${
                        active
                          ? 'bg-surface-elevated text-urushi font-semibold border-b-2 border-b-urushi'
                          : 'text-foreground-soft hover:bg-surface-elevated/60 hover:text-foreground'
                      }`}
                    >
                      <span className="block text-xs sm:text-sm">
                        {slot}
                        {isCurrent && (
                          <span className="ml-1.5 inline-block px-1.5 py-0.5 text-[10px] bg-urushi text-washi rounded-xs font-normal">
                            Now
                          </span>
                        )}
                      </span>
                      <span className="block font-tabular text-[11px] text-muted">
                        {slot === 'Lunch' && '11:30–14:30'}
                        {slot === 'Sunset' && '14:30–17:30'}
                        {slot === 'Dinner' && '17:30–22:00'}
                        {slot === 'Midnight' && '22:00–23:30'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected slot dishes */}
              <div className="p-4 sm:p-5 space-y-4">
                <p className="text-xs sm:text-sm text-foreground-soft">{slotInfo.summary}</p>
                <ul className="divide-y divide-[color:var(--color-border)]">
                  {slotInfo.highlights.map((item) => (
                    <li
                      key={item.name}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-baseline justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-sm sm:text-base font-medium text-foreground">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted" translate="no">
                            {item.ja}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                                item.badge.includes('Vegan') || item.badge.includes('Vegetarian')
                                  ? 'bg-koji/12 text-koji border border-koji/30'
                                  : 'bg-urushi/10 text-urushi border border-urushi/25'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground-soft mt-0.5">{item.note}</p>
                      </div>
                      <span className="font-tabular text-sm font-medium text-foreground whitespace-nowrap">
                        {formatYen(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex items-center justify-between border-t border-[color:var(--color-border)] text-xs">
                  <span className="text-muted">
                    All prices include tax · Cash, IC Card, Credit Card &amp; QR accepted
                  </span>
                  <Link
                    href={`/menu?slot=${selectedSlot}`}
                    className="font-medium text-urushi hover:text-urushi-deep underline underline-offset-4"
                  >
                    See all {selectedSlot} items
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Real Store & Bowl Photo Ledger (no dark muddy overlays) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="ledger-frame overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-surface-muted">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-kasshoku-deep/90 text-washi text-xs font-medium px-2.5 py-1 rounded-xs border border-washi/15">
                    {activePhoto.tag}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-surface-elevated border-t border-[color:var(--color-border)]">
                <p className="font-serif text-base font-medium text-foreground">
                  {activePhoto.title}
                </p>
                <p className="text-xs text-foreground-soft mt-1 leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>
            </div>

            {/* Accessible thumbnail selector (each button >= 56px height) */}
            <div
              className="grid grid-cols-4 gap-2"
              role="group"
              aria-label="Select store and dish photograph"
            >
              {HERO_GALLERY.map((photo, idx) => {
                const isSelected = idx === activePhotoIndex;
                return (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    aria-label={`Show photo: ${photo.title}`}
                    aria-pressed={isSelected}
                    className={`relative overflow-hidden rounded-xs border text-left transition-colors ${
                      isSelected
                        ? 'border-2 border-urushi ring-1 ring-urushi'
                        : 'border-[color:var(--color-border-strong)] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-surface-muted">
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                    <span className="block px-1.5 py-1 text-[11px] font-medium text-foreground truncate bg-surface-elevated">
                      {photo.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
