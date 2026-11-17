'use client';

import { motion } from 'framer-motion';
import type { MenuCategory, TimeSlot } from '@/domain/types';
import { Button } from '@/components/ui/Button';

export const TIME_LABELS: Record<TimeSlot, string> = {
  Lunch: '11:30〜14:30 Lunch',
  Sunset: '14:30〜17:30 Sunset',
  Dinner: '17:30〜22:00 Dinner',
  Midnight: '22:00〜23:30 Midnight (Wed–Sat)',
};

export interface MenuFilterBarProps {
  activeTime: TimeSlot;
  onSelectTime: (slot: TimeSlot) => void;
  midnightAvailable: boolean;
  categories: MenuCategory[];
  categoryLabels: Record<MenuCategory, { en: string; ja: string; description: string }>;
  activeCategory: string | null;
  onSelectCategory: (category: MenuCategory) => void;
}

export function MenuFilterBar({
  activeTime,
  onSelectTime,
  midnightAvailable,
  categories,
  categoryLabels,
  activeCategory,
  onSelectCategory,
}: MenuFilterBarProps) {
  return (
    <>
      {/* Sticky Time-Slot Bar */}
      <nav
        aria-label="Service time slots"
        className="sticky top-0 z-30 bg-kasshoku-deep/95 backdrop-blur-md shadow-[0_2px_20px_-4px_rgba(31,26,20,0.5)] py-3 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex justify-center min-w-max gap-2">
              {(Object.keys(TIME_LABELS) as TimeSlot[])
                .filter((time) => time !== 'Midnight' || midnightAvailable)
                .map((time) => (
                  <Button
                    key={time}
                    size="sm"
                    variant={activeTime === time ? 'time-active' : 'time-inactive'}
                    onClick={() => onSelectTime(time)}
                    className="whitespace-nowrap"
                  >
                    {TIME_LABELS[time]}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Sticky Category Bar */}
      <nav
        aria-label="Menu categories"
        className="sticky top-[56px] z-20 bg-background/95 backdrop-blur-md border-b border-kasshoku/10 shadow-[0_4px_16px_-8px_rgba(91,58,41,0.15)] py-2.5"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-start overflow-x-auto no-scrollbar gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`relative px-3 py-1.5 text-sm font-light rounded-sm transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'text-shibu-aka'
                    : 'text-foreground-soft hover:text-shibu-aka'
                }`}
              >
                {categoryLabels[cat].en}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-shibu-aka"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
