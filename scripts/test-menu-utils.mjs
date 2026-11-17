import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasMenuImage,
  formatYen,
  getPriceEntries,
  getPriceSummary,
  isMidnightDay,
  getDefaultTimeSlot,
  getStoreStatus,
  filterMenuItems,
} from '../lib/menuUtils.ts';

test('hasMenuImage returns true only for files that actually exist in public/images/menu', () => {
  assert.equal(hasMenuImage('/images/menu/white-miso.jpg'), true);
  assert.equal(hasMenuImage('/images/menu/red-miso.jpg'), true);
  assert.equal(hasMenuImage('/images/menu/osaru-ipa.jpg'), true);
  // Missing 29 images should return false to prevent 400 errors
  assert.equal(hasMenuImage('/images/menu/kogashi-white-miso.jpg'), false);
  assert.equal(hasMenuImage('/images/menu/ringo-cocktail.jpg'), false);
  assert.equal(hasMenuImage('/images/menu/ginger-ale.jpg'), false);
  assert.equal(hasMenuImage(''), false);
  assert.equal(hasMenuImage('/images/menu/.DS_Store'), false);
});

test('formatYen and getPriceSummary format single and multi-variant prices with Intl', () => {
  assert.equal(formatYen(1080), '¥1,080');
  assert.equal(getPriceSummary(900), '¥900');
  assert.equal(
    getPriceSummary({ normal: 1080, '+egg': 1240, kake: 700, kids: 500, special: 1680 }),
    '¥500–¥1,680'
  );
  const entries = getPriceEntries({ normal: 1080, special: 1680 });
  assert.deepEqual(entries, [
    { label: 'normal', price: 1080, formatted: '¥1,080' },
    { label: 'special', price: 1680, formatted: '¥1,680' },
  ]);
});

test('isMidnightDay and getDefaultTimeSlot handle Wed-Sat midnight vs Sun/Mon/Tue', () => {
  // Wednesday 12:15 -> Lunch
  const wedLunch = new Date('2026-11-18T12:15:00+09:00');
  assert.equal(isMidnightDay(wedLunch), true);
  assert.equal(getDefaultTimeSlot(wedLunch), 'Lunch');

  // Thursday 15:00 -> Sunset
  const thuSunset = new Date('2026-11-19T15:00:00+09:00');
  assert.equal(getDefaultTimeSlot(thuSunset), 'Sunset');

  // Friday 19:00 -> Dinner
  const friDinner = new Date('2026-11-20T19:00:00+09:00');
  assert.equal(getDefaultTimeSlot(friDinner), 'Dinner');

  // Saturday 22:30 -> Midnight
  const satMidnight = new Date('2026-11-21T22:30:00+09:00');
  assert.equal(isMidnightDay(satMidnight), true);
  assert.equal(getDefaultTimeSlot(satMidnight), 'Midnight');

  // Sunday 22:30 -> Midnight not available on Sunday, falls back to Dinner
  const sunLate = new Date('2026-11-22T22:30:00+09:00');
  assert.equal(isMidnightDay(sunLate), false);
  assert.equal(getDefaultTimeSlot(sunLate), 'Dinner');
});

test('getStoreStatus accurately reflects Mon/Tue closed days and Wed-Sun operating hours', () => {
  // Tuesday 13:00 -> Closed (regular holiday)
  const tue = new Date('2026-11-17T13:00:00+09:00');
  const tueStatus = getStoreStatus(tue);
  assert.equal(tueStatus.isOpen, false);
  assert.match(tueStatus.label, /Closed Tue/i);

  // Wednesday 13:00 -> Open (Lunch service)
  const wed = new Date('2026-11-18T13:00:00+09:00');
  const wedStatus = getStoreStatus(wed);
  assert.equal(wedStatus.isOpen, true);
  assert.equal(wedStatus.activeSlot, 'Lunch');

  // Sunday 21:45 -> Open (after 21:30 LO, closes 22:00)
  const sunClose = new Date('2026-11-22T22:15:00+09:00');
  const sunStatus = getStoreStatus(sunClose);
  assert.equal(sunStatus.isOpen, false);
});

test('filterMenuItems filters by timeSlot, dietary preference, and handles empty states', () => {
  const sampleItems = [
    {
      id: 'white-miso',
      name: 'White Miso Ramen',
      category: 'Ramen',
      priceYen: { normal: 1080 },
      ingredients: ['pork chashu'],
      dietary: ['pork'],
      allergies: ['soy', 'wheat'],
      imageUrl: '/images/menu/white-miso.jpg',
      description: 'Signature white miso ramen',
      availableAt: ['Lunch', 'Sunset', 'Dinner'],
    },
    {
      id: 'vegan-tantanmen',
      name: 'Tantanmen',
      category: 'Ramen',
      priceYen: { normal: 1180, vegan: 1350 },
      ingredients: ['soy milk', 'sake kasu'],
      dietary: ['vegan', 'vegetarian'],
      allergies: ['soy', 'peanuts'],
      imageUrl: '/images/menu/vegan-tantanmen.jpg',
      description: 'Rich plant-based tantanmen with Akishika sake lees',
      availableAt: ['Dinner'],
    },
    {
      id: 'spicy-miso',
      name: 'Spicy Miso Ramen',
      category: 'Ramen',
      priceYen: 1180,
      ingredients: ['chili oil', 'pork chashu'],
      dietary: ['pork', 'spicy'],
      allergies: ['soy', 'wheat'],
      imageUrl: '/images/menu/spicy-miso.jpg',
      description: 'Korean-style spicy miso',
      availableAt: ['Dinner'],
    },
  ];

  // Dinner + all -> 3 items
  assert.equal(
    filterMenuItems(sampleItems, { timeSlot: 'Dinner', dietaryFilter: 'all' }).length,
    3
  );

  // Dinner + plant-based -> only vegan-tantanmen
  const plantBased = filterMenuItems(sampleItems, {
    timeSlot: 'Dinner',
    dietaryFilter: 'plant-based',
  });
  assert.equal(plantBased.length, 1);
  assert.equal(plantBased[0].id, 'vegan-tantanmen');

  // Dinner + no-pork -> only vegan-tantanmen
  const noPork = filterMenuItems(sampleItems, {
    timeSlot: 'Dinner',
    dietaryFilter: 'no-pork',
  });
  assert.equal(noPork.length, 1);
  assert.equal(noPork[0].id, 'vegan-tantanmen');

  // Sunset + plant-based -> 0 items (edge case: empty state)
  const sunsetPlant = filterMenuItems(sampleItems, {
    timeSlot: 'Sunset',
    dietaryFilter: 'plant-based',
  });
  assert.equal(sunsetPlant.length, 0);
});
