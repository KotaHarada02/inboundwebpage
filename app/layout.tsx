import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import { Footer } from '@/components/ui/Footer';
import { RestaurantJsonLd } from '@/components/seo/RestaurantJsonLd';

const SITE_URL = 'https://mitsukabose.com';
const SITE_NAME = 'Mitsukabose (みつか坊主) — Fermented Miso Ramen, Osaka Craft Beer & Natural Sake';
const SITE_DESCRIPTION =
  'Mitsukabose (発酵と味噌と麺 みつか坊主) is a fermentation dining hall in Hotarugaike, Toyonaka, Osaka — 1 minute from Hotarugaike Station East Exit and 3 minutes by monorail from Osaka Itami Airport (ITM). Serving slow-brewed white-miso ramen, vegan tantanmen, Akishika natural sake, and Minoh & Orizé craft beer.';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Shippori+Mincho:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F6F2EA',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Mitsukabose (みつか坊主)',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Mitsukabose',
  authors: [{ name: 'Mitsukabose', url: SITE_URL }],
  creator: 'Mitsukabose',
  publisher: 'Mitsukabose',
  generator: 'Next.js',
  keywords: [
    'Mitsukabose',
    'みつか坊主',
    'miso ramen',
    '味噌ラーメン',
    'fermentation',
    '発酵',
    'craft beer',
    'クラフトビール',
    'Akishika sake',
    '秋鹿',
    'Hotarugaike',
    '蛍池',
    'Itami Airport ramen',
    'Toyonaka',
    '豊中',
    'Osaka vegan ramen',
  ],
  category: 'restaurant',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'ja-JP': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
    url: SITE_URL,
    siteName: 'Mitsukabose',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/hero/0303_1N0A1489.jpg',
        width: 1200,
        height: 800,
        alt: 'Guests enjoying miso ramen at Mitsukabose in Hotarugaike, Osaka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/images/hero/0303_1N0A1489.jpg'],
    creator: '@mitsukabose',
    site: '@mitsukabose',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'msapplication-TileColor': '#A32C1E',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <RestaurantJsonLd />
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-urushi focus:text-washi focus:px-4 focus:py-2.5 focus:rounded-xs focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
