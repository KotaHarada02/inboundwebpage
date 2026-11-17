import Image from 'next/image';
import Link from 'next/link';

const CHAPTERS = [
  {
    title: 'Cultivating People & Fermentation',
    ja: '人を醸す食堂',
    image: '/images/hero/0054_1N0A0937.jpg',
    alt: 'Mitsukabose chef holding a tray of five seasonal fermented small plates',
    body: 'A single bowl of miso ramen can reset someone’s day. Alongside white and red miso broths, we serve seasonal fermented small plates and vegan bowls made with Akishika sake lees.',
  },
  {
    title: 'Back to Our Origin in Hotarugaike',
    ja: '2022年、創業の地・蛍池へ集約',
    image: '/images/food-and-drinks/mitsukabose-food.jpg',
    alt: 'The 2nd-floor dining room at Mitsukabose with wooden tables and arched steel window',
    body: 'In 2022, after a decade in both Umeda and Hotarugaike, we brought everything back to our original neighborhood—creating a 2nd-floor dining room where locals and airport travelers share the same table.',
  },
  {
    title: 'Northern Osaka’s Satoyama Brewers',
    ja: '北摂・能勢と箕面の醸造家たち',
    image: '/images/food-and-drinks/akishika-sake.jpg',
    alt: 'Bottles of Akishika sake brewed in Nose Town, Osaka',
    body: 'We pour pesticide-free junmai sake from Akishika Brewery in Nose Town, craft beer from Minoh Beer, gluten-free rice-koji ales from Orizé, and Kaachan Miso from Toyono Town.',
  },
] as const;

export default function MitsukaValuesSection() {
  return (
    <section
      id="values"
      aria-labelledby="values-heading"
      className="py-12 sm:py-16 border-b border-[color:var(--color-border)] bg-surface"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Intro with the circular emblem */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted" translate="no">
              発酵と味噌と麺 みつか坊主
            </p>
            <h2
              id="values-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-0.5"
            >
              Our Story in Northern Osaka
            </h2>
          </div>
          <Link
            href="/food-and-drinks"
            className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:text-urushi transition-colors"
          >
            Meet our partner breweries
          </Link>
        </div>

        {/* Horizontal Swipe Rail on Mobile, 3-Column Editorial Spread on Desktop */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-5 -mx-4 px-4 md:mx-0 md:px-0 pb-2 no-scrollbar">
          {CHAPTERS.map((ch) => (
            <article
              key={ch.title}
              className="flex-none w-[82vw] max-w-[320px] md:w-auto md:max-w-none snap-start space-y-3"
            >
              <div className="relative aspect-[4/3] w-full bg-surface-muted overflow-hidden">
                <Image
                  src={ch.image}
                  alt={ch.alt}
                  fill
                  sizes="(max-width: 768px) 82vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1.5 pt-1">
                <p className="text-xs text-urushi" translate="no">
                  {ch.ja}
                </p>
                <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
                  {ch.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-soft leading-relaxed">
                  {ch.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
