import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import MitsukaValuesSection from '@/components/sections/MitsukaValuesSection';
import AccessSection from '@/components/sections/AccessSection';

export const metadata: Metadata = {
  title: 'Fermented White-Miso Ramen, Osaka Craft Beer & Natural Sake in Hotarugaike',
  description:
    'Mitsukabose (みつか坊主) — slow-brewed white-miso ramen, vegan tantanmen, Akishika natural sake, and Minoh craft beer 1 minute from Hotarugaike Station East Exit (1 stop from Osaka Itami Airport).',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <HeroSection />
      <MitsukaValuesSection />
      <AccessSection />
    </div>
  );
}
