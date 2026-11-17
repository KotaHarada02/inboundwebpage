import type { Metadata } from 'next';
import '../globals.css';
import Providers from '@/components/Providers';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === 'en') {
    return {
      title: 'Mitsukabose Miso Ramen | Authentic Ramen in Osaka, Japan',
      description:
        'Specialty Miso Ramen restaurant near Osaka Itami Airport (ITM). We offer authentic Japanese ramen, including delicious vegan and vegetarian options. A must-visit ramen spot in Hotarugaike, Osaka.',
    };
  }
  return {
    title: '発酵と味噌と麺 みつか坊主 | 大阪・蛍池のラーメン店',
    description:
      '大阪空港近く、蛍池駅徒歩1分。自家製味噌と発酵の技術を活かしたこだわりの味噌ラーメンをご提供。ビーガン、ベジタリアン向けメニューもございます。',
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'ja';

  const origin =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_SITE_URL || 'https://mitsukabose.com'
      : 'https://mitsukabose.com';
  const altJa = `${origin}/ja`;
  const altEn = `${origin}/en`;

  return (
    <html lang={lang}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" href={altJa} hrefLang="ja" />
        <link rel="alternate" href={altEn} hrefLang="en" />
        <link rel="alternate" href={lang === 'ja' ? altJa : altEn} hrefLang="x-default" />
      </head>
      <body className="bg-background text-foreground antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
