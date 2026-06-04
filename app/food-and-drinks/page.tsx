import type { Metadata } from 'next';
import FoodAndDrinksClient from './FoodAndDrinksClient';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Food & Drinks — Miso Ramen, Akishika Sake, Minoh & Orizé Beer',
  description:
    'A curated showcase of Mitsukabose pairings: slow-brewed white-miso ramen, Akishika Shuzō sake from Osaka, Minoh craft beer, and the rice-based Orizé Brewing lineup.',
  alternates: { canonical: '/food-and-drinks' },
  openGraph: {
    title: 'Food & Drinks — Mitsukabose',
    description:
      'Miso ramen, Akishika sake, Minoh craft beer, and Orizé rice ale — pairings born in Osaka.',
    url: '/food-and-drinks',
    type: 'website',
  },
};

export default function FoodAndDrinksPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Food & Drinks', path: '/food-and-drinks' },
        ]}
      />
      <FoodAndDrinksClient />
    </>
  );
}
