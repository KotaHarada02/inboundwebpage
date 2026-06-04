import type { Metadata } from 'next';
import AccessClient from './AccessClient';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Access — 1 min from Hotarugaike Station, Toyonaka',
  description:
    'Find Mitsukabose on the 2nd floor of the Airport Center Building, 1 minute from Hotarugaike Station East Exit (Hankyu Takarazuka Line & Osaka Monorail). Wed–Sat 11:30–24:00, Sun 11:30–22:00.',
  alternates: { canonical: '/access' },
  openGraph: {
    title: 'Access — Mitsukabose, Hotarugaike',
    description:
      '1 minute from Hotarugaike Station East Exit. 2F Airport Center Bldg., Toyonaka, Osaka.',
    url: '/access',
    type: 'website',
  },
};

export default function AccessPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Access', path: '/access' },
        ]}
      />
      <AccessClient />
    </>
  );
}
