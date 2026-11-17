import type { Metadata } from 'next';
import MenuClient from './MenuClient';
import { getMenuItems } from '@/domain/services/dataService';
import { MenuJsonLd } from '@/components/seo/MenuJsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Menu — Miso Ramen, Akishika Sake & Fermented Small Plates',
  description:
    'Explore the full Mitsukabose menu: signature white-miso ramen, vegan tantanmen, fermented side dishes, Akishika sake, craft beer, and seasonal sets. Updated for 2026.',
  alternates: { canonical: '/menu' },
  openGraph: {
    title: 'Mitsukabose Menu — Fermented Miso Ramen & Craft Beer',
    description:
      'Slow-brewed white-miso ramen, vegan tantanmen, Akishika sake, craft beer and seasonal small plates in Hotarugaike, Osaka.',
    url: '/menu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitsukabose Menu — Fermented Miso Ramen & Craft Beer',
    description: 'Slow-brewed white-miso ramen, Akishika sake, craft beer and seasonal small plates.',
  },
};

export default function MenuPage() {
  const items = getMenuItems();

  return (
    <>
      <MenuJsonLd items={items} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Menu', path: '/menu' },
        ]}
      />
      <MenuClient />
    </>
  );
}
