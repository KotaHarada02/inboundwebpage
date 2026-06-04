import type { Metadata } from 'next';
import EventsClient from './EventsClient';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = {
  title: 'Events & Community Rewards',
  description:
    'Join the Mitsukabose community. Get a free original sticker for visiting our website, or receive a premium miso sample for sharing your honest Google review.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'Events & Community Rewards — Mitsukabose',
    description:
      'Visit our website and get a free sticker. Share a Google review and receive a premium miso sample. Hotarugaike, Osaka.',
    url: '/events',
    type: 'website',
  },
};

export default function EventsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
        ]}
      />
      <EventsClient />
    </>
  );
}
