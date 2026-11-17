export const siteConfig = {
  name: 'Mitsukabose (みつか坊主) — Fermented Miso Ramen, Osaka Craft Beer & Natural Sake',
  shortName: 'Mitsukabose',
  japaneseName: '発酵と味噌と麺 みつか坊主',
  url: 'https://mitsukabose.com',
  description:
    'Mitsukabose (発酵と味噌と麺 みつか坊主) is a fermentation dining hall in Hotarugaike, Toyonaka, Osaka — 1 minute from Hotarugaike Station East Exit and 3 minutes by monorail from Osaka Itami Airport (ITM). Slow-brewed white-miso ramen, vegan tantanmen, Akishika sake, and Minoh & Orizé craft beer.',
  locale: 'en_US',
  telephone: '+81-6-6850-3532',
  ogImage: '/images/hero/0303_1N0A1489.jpg',
  links: {
    instagram: 'https://www.instagram.com/mitsukabose.official/',
    twitter: 'https://x.com/mitsukabose',
    map: 'https://maps.app.goo.gl/HWZm8vedVNUbZzjt5',
    official: 'https://mitsukabose.com',
  },
  hours: {
    wedToSat: '11:30–24:00 (Last order 23:30)',
    sunday: '11:30–22:00 (Last order 21:30)',
    closed: 'Monday & Tuesday',
    serviceSlots: [
      { id: 'Lunch', label: 'Lunch', time: '11:30–14:30', note: 'Wed–Sun' },
      { id: 'Sunset', label: 'Sunset', time: '14:30–17:30', note: 'Wed–Sun' },
      { id: 'Dinner', label: 'Dinner', time: '17:30–22:00', note: 'Wed–Sun (Sun LO 21:30)' },
      { id: 'Midnight', label: 'Midnight', time: '22:00–24:00', note: 'Wed–Sat only (LO 23:30)' },
    ],
  },
  contact: {
    postalCode: '560-0032',
    address: '2F, Airport Center Building, 1-6-5 Hotarugaike Higashimachi, Toyonaka, Osaka 560-0032, Japan',
    addressJa: '〒560-0032 大阪府豊中市蛍池東町1-6-5 エアポートセンタービル 2F',
    nearestStation: '1-minute walk from Hotarugaike Station East Exit (Hankyu Takarazuka Line & Osaka Monorail)',
    airportAccess: '1 stop (3 minutes) from Osaka Itami Airport (ITM) via Osaka Monorail',
  },
} as const;
