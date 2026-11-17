import type { MenuItem, TimeSlot } from '../domain/types';

/**
 * Exact set of menu image files verified to exist in public/images/menu/
 * Prevents Next.js /_next/image 400 Bad Request errors for the 29 unphotographed items.
 */
export const EXISTING_MENU_IMAGES = new Set<string>([
  '/images/menu/aged-limited.jpg',
  '/images/menu/akishika-highball.jpg',
  '/images/menu/akishika-tasting.jpg',
  '/images/menu/atsuage.jpg',
  '/images/menu/beer-001.jpg',
  '/images/menu/black-head-ipa.jpg',
  '/images/menu/burnt-shrimp-miso-ramen.jpg',
  '/images/menu/choinomi-set.jpg',
  '/images/menu/draft-regular.jpg',
  '/images/menu/draft-seasonal.jpg',
  '/images/menu/fermentation-gozen.jpg',
  '/images/menu/fermented-fries.jpg',
  '/images/menu/hokkaido-miso-corn.jpg',
  '/images/menu/ippin-5.jpg',
  '/images/menu/japanese-white-no9-barrel.jpg',
  '/images/menu/junmai-daiginjo.jpg',
  '/images/menu/junmai-ginjo.jpg',
  '/images/menu/junmai.jpg',
  '/images/menu/kae-dama.jpg',
  '/images/menu/karaage-gozen.jpg',
  '/images/menu/karaage-shin.jpg',
  '/images/menu/kids-ramen.jpg',
  '/images/menu/light-shrimp-miso-ramen.jpg',
  '/images/menu/local-pickles.jpg',
  '/images/menu/marinated-noodle-refill-egg.jpg',
  '/images/menu/marinated-noodle-refill-garlic.jpg',
  '/images/menu/midnight-red-miso.jpg',
  '/images/menu/midnight-tsukemen-6.jpeg',
  '/images/menu/midnight-tsukemen-6.jpg',
  '/images/menu/midnight-tsukemen-8.jpg',
  '/images/menu/midnight-white-miso.jpg',
  '/images/menu/miso-chashu-carpaccio.jpg',
  '/images/menu/niku-miso-tofu.jpg',
  '/images/menu/oden-3.jpg',
  '/images/menu/oden-7.jpg',
  '/images/menu/orize-malt-pale-ale.jpg',
  '/images/menu/oryzae-golden-ale.jpg',
  '/images/menu/osaru-ipa.jpg',
  '/images/menu/pale-ale.jpg',
  '/images/menu/parallel-ipa.jpg',
  '/images/menu/pilsner.jpg',
  '/images/menu/potato-salad.jpg',
  '/images/menu/red-miso.jpg',
  '/images/menu/sake-001.jpg',
  '/images/menu/shrimp-curry.jpg',
  '/images/menu/spicy-miso.jpg',
  '/images/menu/stout.jpg',
  '/images/menu/toyono-ramen.jpg',
  '/images/menu/tsukemen-ver8.jpg',
  '/images/menu/vegan-tantanmen.jpg',
  '/images/menu/vege-board.jpg',
  '/images/menu/vegi-miso.jpg',
  '/images/menu/w-ipa.jpg',
  '/images/menu/weizen.jpg',
  '/images/menu/white-miso.jpg',
  '/images/menu/yoidore-set.jpg',
]);

const jpyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

export function hasMenuImage(imageUrl?: string | null): boolean {
  if (!imageUrl || imageUrl.includes('.DS_Store')) return false;
  return EXISTING_MENU_IMAGES.has(imageUrl);
}

export function formatYen(amount: number): string {
  return jpyFormatter.format(amount);
}

export interface PriceEntry {
  label: string;
  price: number;
  formatted: string;
}

export function getPriceEntries(priceYen: MenuItem['priceYen']): PriceEntry[] {
  if (typeof priceYen === 'number') {
    return [{ label: 'Standard', price: priceYen, formatted: formatYen(priceYen) }];
  }
  return Object.entries(priceYen)
    .filter(([, value]) => typeof value === 'number' && !Number.isNaN(value))
    .map(([label, price]) => ({
      label,
      price,
      formatted: formatYen(price),
    }));
}

export function getPriceSummary(priceYen: MenuItem['priceYen']): string {
  if (typeof priceYen === 'number') {
    return formatYen(priceYen);
  }
  const values = Object.values(priceYen).filter(
    (v): v is number => typeof v === 'number' && !Number.isNaN(v)
  );
  if (values.length === 0) return 'Ask staff';
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return formatYen(min);
  return `${formatYen(min)}–${formatYen(max)}`;
}

function getJstParts(date: Date): { day: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const weekdayStr = parts.find((p) => p.type === 'weekday')?.value ?? 'Wed';
  const hourStr = parts.find((p) => p.type === 'hour')?.value ?? '18';
  const minuteStr = parts.find((p) => p.type === 'minute')?.value ?? '0';

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const day = dayMap[weekdayStr] ?? 3;
  const hour = Number(hourStr) % 24;
  const minute = Number(minuteStr);
  return { day, minutes: hour * 60 + minute };
}

export function isMidnightDay(date: Date = new Date()): boolean {
  const { day } = getJstParts(date);
  return [3, 4, 5, 6].includes(day); // Wed–Sat
}

export function getDefaultTimeSlot(date: Date = new Date()): TimeSlot {
  const { day, minutes } = getJstParts(date);
  if ([3, 4, 5, 6].includes(day) && minutes >= 1320 && minutes < 1440) {
    return 'Midnight'; // 22:00–24:00 Wed–Sat
  }
  if (minutes >= 1050 && minutes < 1320) {
    return 'Dinner'; // 17:30–22:00
  }
  if (minutes >= 870 && minutes < 1050) {
    return 'Sunset'; // 14:30–17:30
  }
  if (minutes >= 690 && minutes < 870) {
    return 'Lunch'; // 11:30–14:30
  }
  return 'Dinner';
}

export interface StoreStatus {
  isOpen: boolean;
  label: string;
  detail: string;
  activeSlot: TimeSlot;
}

export function getStoreStatus(date: Date = new Date()): StoreStatus {
  const { day, minutes } = getJstParts(date);
  const activeSlot = getDefaultTimeSlot(date);

  if (day === 1 || day === 2) {
    const dayName = day === 1 ? 'Mon' : 'Tue';
    return {
      isOpen: false,
      label: `Closed ${dayName} (Regular Holiday)`,
      detail: 'Reopens Wednesday at 11:30',
      activeSlot: 'Dinner',
    };
  }

  const isSunday = day === 0;
  const closeMinutes = isSunday ? 22 * 60 : 24 * 60;
  const loStr = isSunday ? '21:30' : '23:30';
  const closeStr = isSunday ? '22:00' : '24:00';

  if (minutes >= 690 && minutes < closeMinutes) {
    return {
      isOpen: true,
      label: `Open Now · ${activeSlot} Service`,
      detail: `Today 11:30–${closeStr} (Last order ${loStr})`,
      activeSlot,
    };
  }

  if (minutes < 690) {
    return {
      isOpen: false,
      label: 'Opens Today at 11:30',
      detail: `Today 11:30–${closeStr} (Last order ${loStr})`,
      activeSlot: 'Lunch',
    };
  }

  return {
    isOpen: false,
    label: 'Closed for Today',
    detail: day === 0 ? 'Closed Mon & Tue · Reopens Wed 11:30' : 'Opens tomorrow at 11:30',
    activeSlot: 'Dinner',
  };
}

export type DietaryFilter = 'all' | 'plant-based' | 'no-pork' | 'spicy';

export function filterMenuItems(
  items: MenuItem[],
  options: {
    timeSlot: TimeSlot;
    dietaryFilter?: DietaryFilter;
    searchQuery?: string;
  }
): MenuItem[] {
  const { timeSlot, dietaryFilter = 'all', searchQuery = '' } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const matchesTime = item.availableAt
      ? item.availableAt.includes(timeSlot)
      : timeSlot === 'Dinner';
    if (!matchesTime) return false;

    const tags = (item.dietary ?? []).map((t) => t.toLowerCase());
    const ingredients = (item.ingredients ?? []).map((i) => i.toLowerCase());

    if (dietaryFilter === 'plant-based') {
      const isPlantBased =
        tags.includes('vegan') ||
        tags.includes('vegetarian') ||
        tags.includes('ビーガン') ||
        tags.includes('ベジタリアン');
      if (!isPlantBased) return false;
    } else if (dietaryFilter === 'no-pork') {
      const hasPork =
        tags.includes('pork') ||
        ingredients.some((i) => i.includes('pork') || i.includes('chashu'));
      if (hasPork) return false;
    } else if (dietaryFilter === 'spicy') {
      const isSpicy =
        tags.includes('spicy') ||
        ingredients.some((i) => i.includes('chili') || i.includes('spicy')) ||
        item.name.toLowerCase().includes('spicy') ||
        item.name.toLowerCase().includes('tantanmen');
      if (!isSpicy) return false;
    }

    if (normalizedQuery) {
      const haystack = `${item.name} ${item.description} ${ingredients.join(' ')}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }

    return true;
  });
}
