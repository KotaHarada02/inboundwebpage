import Image from 'next/image';
import Link from 'next/link';

const STORIES = [
  {
    id: 'fermentation-hall',
    title: 'A Table Where Fermented Flavors and People Meet',
    subtitleJa: '人を醸す「発酵と味噌と麺」の食堂',
    image: '/images/hero/0054_1N0A0937.jpg',
    imageAlt: 'Mitsukabose chef holding a wooden tray of five seasonal fermented small plates in front of the open kitchen',
    imageCaption: 'Our open kitchen in Hotarugaike — serving seasonal fermented small plates alongside slow-brewed miso ramen.',
    body: [
      'Mitsukabose is more than a quick noodle counter. We built our kitchen around the living craft of fermentation: white and red misos aged in wooden barrels, sake lees from Nose mountains, and house-fermented vegetables.',
      'Whether you come for a single steaming bowl of White Miso Ramen to reset after a flight, or linger over five small fermented plates with a glass of unfiltered sake, every dish is made to warm the body and spark conversation across the table.',
    ],
    highlights: [
      'House-blended white, red, and Toyono Town Kaachan miso broths',
      '100% plant-based Vegan Tantanmen enriched with Akishika sake lees and soy milk',
      'Seasonal fermented side dishes (Ippin), oden, and daytime drinking sets',
    ],
  },
  {
    id: 'returning-to-hotarugaike',
    title: 'Why We Consolidated Back to Our Origin in Hotarugaike in 2022',
    subtitleJa: '2022年、梅田から創業の地・蛍池への「再発酵」',
    image: '/images/food-and-drinks/mitsukabose-food.jpg',
    imageAlt: 'The 2nd-floor dining hall at Mitsukabose featuring communal wooden tables, paper lanterns, and a large arched steel window',
    imageCaption: 'The 2nd-floor dining room at Hotarugaike Station — antique wooden tables, paper lanterns, and the arched window overlooking the monorail.',
    body: [
      'After more than a decade of running shops in both central Umeda and Hotarugaike, we made a deliberate choice in 2022 to bring everything back to where Mitsukabose began: Hotarugaike.',
      'Rather than chasing high-turnover city crowds, we wanted a neighborhood fermentation hub where local families, brewers, airport staff, and travelers passing through Itami Airport sit under the same roof.',
    ],
    highlights: [
      'Spacious 2nd-floor dining room with communal wooden tables and counter seating',
      'Directly in front of Hotarugaike Station East Exit (1 stop from Osaka Itami Airport)',
      'Wall relief by local artists celebrating the playful spirit of Mitsukabose',
    ],
  },
  {
    id: 'hokusetsu-producers',
    title: 'Rooted in Northern Osaka’s Hokusetsu Satoyama Breweries',
    subtitleJa: '北摂・能勢・箕面・豊能の生産者とともに醸す',
    image: '/images/food-and-drinks/akishika-sake.jpg',
    imageAlt: 'Bottles of Akishika sake brewed in Nose Town, Osaka, served in a glass choko cup',
    imageCaption: 'Akishika Shuzō (established 1886 in Nose Town, Osaka) — pesticide-free Yamada Nishiki rice grown and brewed by the brewery itself.',
    body: [
      'Northern Osaka (the Hokusetsu region) sits where city rail lines meet rural mountain foothills. Within thirty minutes of our kitchen, independent makers are practicing some of Japan’s most distinctive fermentation.',
      'We pour their work directly at our table and fold their ingredients into our bowls—from Akishika’s high-acidity natural sake and Minoh’s award-winning craft beer to Toyono Town’s handmade Kaachan Miso.',
    ],
    highlights: [
      'Akishika Sake Brewery (Nose Town, Osaka) — organic, self-grown rice sake & sake kasu',
      'Minoh Beer (Minoh, Osaka) — family-run craft brewery famous for Stout, W-IPA & Osaru IPA',
      'Orizé Brewing (Wakayama) — the world’s first gluten-free craft beer fermented with rice koji',
    ],
  },
] as const;

export default function MitsukaValuesSection() {
  return (
    <section
      id="values"
      aria-labelledby="values-heading"
      className="py-16 sm:py-24 border-b border-[color:var(--color-border-strong)] bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — no uppercase eyebrow, no bouncing red italic word */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2
            id="values-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
          >
            Three Stories Behind Our Table in Hotarugaike
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground-soft leading-relaxed">
            Why a fermentation-driven miso ramen house and taproom stands on the 2nd floor of a
            station building in northern Osaka.
          </p>
        </div>

        {/* Editorial Story Rows */}
        <div className="space-y-16 sm:space-y-24">
          {STORIES.map((story, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <article
                key={story.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-10 border-t border-[color:var(--color-border)] first:border-t-0 first:pt-0"
              >
                {/* Image Column */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <figure className="ledger-frame overflow-hidden">
                    <div className="relative aspect-[4/3] w-full bg-surface-muted">
                      <Image
                        src={story.image}
                        alt={story.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="p-3.5 text-xs text-foreground-soft bg-surface-elevated border-t border-[color:var(--color-border)]">
                      {story.imageCaption}
                    </figcaption>
                  </figure>
                </div>

                {/* Editorial Copy Column */}
                <div
                  className={`lg:col-span-6 space-y-5 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div>
                    <p className="font-serif text-sm text-urushi font-medium mb-1.5" translate="no">
                      {story.subtitleJa}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                      {story.title}
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-foreground-soft text-base leading-relaxed measure-prose">
                    {story.body.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="p-4 bg-surface-muted rounded-xs border border-[color:var(--color-border)]">
                    <ul className="space-y-2 text-sm text-foreground">
                      {story.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-urushi mt-2 flex-none"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom link to Producers & Craft page */}
        <div className="mt-14 pt-8 border-t border-[color:var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-serif text-lg text-foreground">
            Want to learn more about Minoh Beer, Orizé rice-koji ale, and Akishika Sake?
          </p>
          <Link
            href="/food-and-drinks"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-surface-elevated hover:bg-surface-muted text-foreground border border-[color:var(--color-border-strong)] text-sm font-medium rounded-xs transition-colors"
          >
            Read Producer Stories &amp; Pairings
          </Link>
        </div>
      </div>
    </section>
  );
}
