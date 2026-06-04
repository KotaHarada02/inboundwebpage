import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Serif_JP } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import { Footer } from '@/components/ui/Footer';
import { RestaurantJsonLd } from '@/components/seo/RestaurantJsonLd';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-serif-jp',
  preload: false,
});

const SITE_URL = 'https://mitsukabose.com';
const SITE_NAME = 'Mitsukabose — Fermented Miso Ramen & Craft Beer';
const SITE_DESCRIPTION =
  'Mitsukabose (みつか坊主) is a fermentation-driven miso ramen and craft beer destination in Hotarugaike, Toyonaka, Osaka. Discover slow-brewed white-miso ramen, Akishika sake, and seasonal small plates 1 minute from Hotarugaike Station.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF7F1' },
    { media: '(prefers-color-scheme: dark)', color: '#1F1A14' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Mitsukabose',
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
    'Toyonaka',
    '豊中',
    'Osaka ramen',
    '大阪 ラーメン',
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
        url: '/images/hero/hero-1.jpg',
        width: 1200,
        height: 630,
        alt: 'A bowl of Mitsukabose white-miso ramen with handmade noodles and chashu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/images/hero/hero-1.jpg'],
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
  verification: {
    // 必要に応じて Google Search Console の verification コードを設定
    // google: 'xxxxxxxxxxxxxxxx',
  },
  other: {
    'msapplication-TileColor': '#5B3A29',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerifJp.variable}`}>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <RestaurantJsonLd />
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-kasshoku focus:text-washi focus:px-4 focus:py-2 focus:rounded"
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
