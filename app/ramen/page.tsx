import { permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ramen Menu',
  description: 'Mitsukabose ramen lineup has moved to the consolidated menu page.',
  alternates: { canonical: '/menu' },
  robots: { index: false, follow: true },
};

export default function RamenPage() {
  permanentRedirect('/menu');
}
