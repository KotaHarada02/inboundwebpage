import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import MitsukaValuesSection from '@/components/sections/MitsukaValuesSection';
import AccessSection from '@/components/sections/AccessSection';
import { getHeroImages } from '@/lib/getHeroImages';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';

export const metadata: Metadata = {
  title: 'Fermented Miso Ramen & Craft Beer in Hotarugaike, Osaka',
  description:
    'Mitsukabose (みつか坊主) — a fermentation theme park serving slow-brewed white-miso ramen, Akishika sake, and craft beer 1 minute from Hotarugaike Station in Toyonaka, Osaka.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const heroImages = getHeroImages();

  return (
    <div className="min-h-screen bg-background">
      <DecorativeBackground />
      <HeroSection images={heroImages} />

      {/* Values section — full-width with internal max-w */}
      <MitsukaValuesSection />

      {/* Elegant divider between sections */}
      <div className="max-w-3xl mx-auto px-8 py-4" aria-hidden="true">
        <div className="divider-elegant">
          <span className="w-1.5 h-1.5 rounded-full bg-kohaku/40" />
        </div>
      </div>

      {/* Access section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AccessSection />
      </div>
    </div>
  );
}
