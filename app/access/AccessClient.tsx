import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';
import { MapPin, Train, Clock, Phone, ExternalLink } from 'lucide-react';

const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.4277464384927!2d135.44954909999998!3d34.7951789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f077fa0f081f%3A0x41a2ef4a75848277!2z55m66YW144Go5ZGz5ZmM44Go6bq6IOOBv-OBpOOBi-WdiuS4uw!5e0!3m2!1sja!2sjp!4v1757148904874!5m2!1sja!2sjp';

export default function AccessClient() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <header className="border-b border-[color:var(--color-border-strong)] bg-surface pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
              Access &amp; 2F Entrance Guide
            </h1>
            <span className="font-serif text-lg text-foreground-soft" translate="no">
              アクセス・2階入口のご案内
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground-soft measure-prose">
            Located 1 minute on foot from Hotarugaike Station East Exit (Hankyu Takarazuka Line
            &amp; Osaka Monorail) and just 1 stop (3 minutes) from Osaka Itami Airport (ITM).
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Step-by-Step Arrival & 2F Entrance Photo */}
        <section
          aria-labelledby="entrance-guide-heading"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left: Step-by-step from station & airport */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2
                id="entrance-guide-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-foreground"
              >
                How to Find Our 2nd-Floor Staircase
              </h2>
              <p className="text-sm sm:text-base text-foreground-soft mt-2 leading-relaxed">
                Mitsukabose is on the 2nd floor of the Airport Center Building directly in front
                of Hotarugaike Station East Exit. Look for the large arched window on the 2nd
                floor and the white noren curtain at the street-level staircase to the left of
                Burger King.
              </p>
            </div>

            <ol className="space-y-4">
              <li className="ledger-frame p-4 sm:p-5 bg-surface-elevated">
                <p className="font-tabular text-xs font-medium text-urushi mb-1">
                  Step 1 · Arrive at Hotarugaike Station (蛍池駅)
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>From Osaka Itami Airport (ITM):</strong> Ride the Osaka Monorail 1 stop
                  (3 minutes) to Hotarugaike Station.
                  <br />
                  <strong>From Osaka-Umeda:</strong> Ride the Hankyu Takarazuka Line Express 15
                  minutes to Hotarugaike Station.
                </p>
              </li>

              <li className="ledger-frame p-4 sm:p-5 bg-surface-elevated">
                <p className="font-tabular text-xs font-medium text-urushi mb-1">
                  Step 2 · Take the East Exit (東口) to Street Level
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  Follow signs for the <strong>East Exit (東口)</strong>. Across the station
                  rotary/street, you will see the Airport Center Building with Burger King on the
                  ground floor and our large arched window on the 2nd floor.
                </p>
              </li>

              <li className="ledger-frame p-4 sm:p-5 bg-surface-elevated">
                <p className="font-tabular text-xs font-medium text-urushi mb-1">
                  Step 3 · Walk Up the Left-Hand Staircase to 2F
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  Pass through the white <strong>MITSUKA BOSE</strong> noren curtain on the left
                  side of the building and walk up the stairs to our 2nd-floor dining hall.
                </p>
              </li>
            </ol>

            {/* Bilingual Show-to-Staff / Taxi Card */}
            <div className="ledger-double-frame p-5 bg-surface-elevated">
              <p className="text-xs font-medium text-urushi mb-1.5 flex items-center gap-1.5">
                <Train className="w-4 h-4" aria-hidden="true" />
                <span>Show this card to station staff or a taxi driver (駅員・タクシー提示用)</span>
              </p>
              <p className="font-serif text-lg font-bold text-foreground" translate="no">
                発酵と味噌と麺 みつか坊主（エアポートセンタービル 2F）
              </p>
              <p className="text-xs sm:text-sm text-foreground-soft mt-1 leading-relaxed" translate="no">
                {siteConfig.contact.addressJa}
                <br />
                阪急宝塚線・大阪モノレール「蛍池駅」東口より徒歩1分（1階バーガーキング左隣の暖簾・階段より2階へ）
              </p>
            </div>
          </div>

          {/* Right: Street-level entrance photo */}
          <figure className="lg:col-span-5 ledger-frame overflow-hidden bg-surface-elevated">
            <div className="relative aspect-[3/4] w-full bg-surface-muted">
              <Image
                src="/images/access/store-front.jpg"
                alt="Street view of the Airport Center Building showing the ground-floor staircase entrance to Mitsukabose on the left and the 2nd-floor arched window on the right"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-bottom"
              />
            </div>
            <figcaption className="p-4 text-xs text-foreground-soft border-t border-[color:var(--color-border)] leading-relaxed">
              Street view at Hotarugaike Station East Exit: enter through the white noren curtain
              at the left staircase and head up to the 2nd floor.
            </figcaption>
          </figure>
        </section>

        {/* Hours, Contact & Map */}
        <section
          aria-labelledby="hours-and-map-heading"
          className="pt-12 border-t border-[color:var(--color-border-strong)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          <div className="lg:col-span-5 space-y-6">
            <h2
              id="hours-and-map-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-foreground"
            >
              Operating Hours &amp; Address
            </h2>

            <div className="ledger-frame divide-y divide-[color:var(--color-border)] bg-surface-elevated">
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                  <Clock className="w-4 h-4 text-urushi" aria-hidden="true" />
                  <span>Weekly Schedule</span>
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-foreground-soft">Wednesday – Saturday</dt>
                    <dd className="font-tabular font-medium text-foreground">
                      11:30–24:00 (LO 23:30)
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-foreground-soft">Sunday</dt>
                    <dd className="font-tabular font-medium text-foreground">
                      11:30–22:00 (LO 21:30)
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2 pt-1.5 border-t border-dotted border-[color:var(--color-border)]">
                    <dt className="text-muted">Monday &amp; Tuesday</dt>
                    <dd className="text-muted font-medium">Closed (Regular Holiday)</dd>
                  </div>
                </dl>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                  <MapPin className="w-4 h-4 text-urushi" aria-hidden="true" />
                  <span>Address</span>
                </div>
                <p className="text-sm text-foreground-soft leading-relaxed">
                  {siteConfig.contact.address}
                </p>
                <p className="text-xs text-muted" translate="no">
                  {siteConfig.contact.addressJa}
                </p>
                <div className="pt-2">
                  <a
                    href={siteConfig.links.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 bg-urushi hover:bg-urushi-deep text-washi text-xs sm:text-sm font-medium rounded-xs transition-colors"
                  >
                    <span>Open Route in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-serif text-base font-bold text-foreground">
                  <Phone className="w-4 h-4 text-urushi" aria-hidden="true" />
                  <span>Telephone</span>
                </div>
                <a
                  href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                  className="font-tabular text-sm font-medium link-underline text-foreground"
                >
                  {siteConfig.telephone}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-surface-elevated hover:bg-surface-muted text-foreground border border-[color:var(--color-border-strong)] text-xs sm:text-sm font-medium rounded-xs transition-colors"
              >
                Browse Menu by Time Slot
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-surface-elevated hover:bg-surface-muted text-foreground border border-[color:var(--color-border-strong)] text-xs sm:text-sm font-medium rounded-xs transition-colors"
              >
                Get Free Website Visitor Sticker
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 min-h-[420px] ledger-frame overflow-hidden">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '420px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mitsukabose location on Google Maps"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
