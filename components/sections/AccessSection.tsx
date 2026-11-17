import Link from 'next/link';
import { getAccessInfo } from '@/domain/services/dataService';
import { siteConfig } from '@/lib/siteConfig';
import { MapPin, Train, Clock, Phone, ExternalLink } from 'lucide-react';

export default function AccessSection() {
  const accessInfo = getAccessInfo();

  return (
    <section
      id="access"
      aria-labelledby="access-heading"
      className="py-16 sm:py-24 bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Heading */}
        <div className="max-w-3xl">
          <h2
            id="access-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
          >
            1 Minute from Hotarugaike Station East Exit
          </h2>
          <p className="mt-3 text-base sm:text-lg text-foreground-soft">
            One stop (3 minutes) from Osaka Itami Airport (ITM) via Osaka Monorail, or 15 minutes
            from Osaka-Umeda on the Hankyu Takarazuka Line.
          </p>
        </div>

        {/* Visual Transit Route Bar */}
        <div
          aria-label="Transit route to Mitsukabose"
          className="ledger-frame p-5 sm:p-6 bg-surface-elevated"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-4 bg-surface-muted rounded-xs border border-[color:var(--color-border)]">
              <p className="font-tabular text-xs font-medium text-urushi mb-1">
                From Osaka Itami Airport (ITM)
              </p>
              <p className="font-serif text-lg font-bold text-foreground">
                1 Stop · 3 Minutes
              </p>
              <p className="text-xs text-foreground-soft mt-1">
                Take the Osaka Monorail bound for Kadoma-shi to <strong>Hotarugaike Station</strong>.
              </p>
            </div>

            <div className="p-4 bg-surface-muted rounded-xs border border-[color:var(--color-border)]">
              <p className="font-tabular text-xs font-medium text-urushi mb-1">
                From Osaka-Umeda Station
              </p>
              <p className="font-serif text-lg font-bold text-foreground">
                15 Minutes by Express
              </p>
              <p className="text-xs text-foreground-soft mt-1">
                Take the Hankyu Takarazuka Line Express or Semi-Express to <strong>Hotarugaike Station</strong>.
              </p>
            </div>

            <div className="p-4 bg-surface-muted rounded-xs border border-[color:var(--color-border)]">
              <p className="font-tabular text-xs font-medium text-urushi mb-1">
                From Hotarugaike East Exit
              </p>
              <p className="font-serif text-lg font-bold text-foreground">
                1-Minute Walk · 2nd Floor
              </p>
              <p className="text-xs text-foreground-soft mt-1">
                Exit the East Gate, find the Airport Center Building (next to Burger King), and walk up the left-hand stairs to 2F.
              </p>
            </div>
          </div>
        </div>

        {/* Details + Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Hours, Address & Bilingual Card for Station Staff / Taxi */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="ledger-frame divide-y divide-[color:var(--color-border)]">
              {/* Hours */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-urushi flex-none mt-1" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                      Operating Hours
                    </h3>
                    <dl className="space-y-1.5 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-foreground-soft">Wednesday – Saturday</dt>
                        <dd className="font-tabular font-medium text-foreground">
                          11:30–24:00 <span className="text-xs text-muted">(LO 23:30)</span>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-foreground-soft">Sunday</dt>
                        <dd className="font-tabular font-medium text-foreground">
                          11:30–22:00 <span className="text-xs text-muted">(LO 21:30)</span>
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 pt-1 border-t border-dotted border-[color:var(--color-border)]">
                        <dt className="text-muted">Closed</dt>
                        <dd className="text-muted font-medium">Monday &amp; Tuesday</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Address & Phone */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-urushi flex-none mt-1" aria-hidden="true" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      Address &amp; Contact
                    </h3>
                    <p className="text-sm text-foreground-soft leading-relaxed">
                      {siteConfig.contact.address}
                    </p>
                    <p className="text-xs text-muted flex items-center gap-2 font-tabular">
                      <Phone className="w-3.5 h-3.5 text-urushi" aria-hidden="true" />
                      <a
                        href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                        className="link-underline text-foreground font-medium"
                      >
                        {siteConfig.telephone}
                      </a>
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href={siteConfig.links.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 bg-urushi hover:bg-urushi-deep text-washi text-xs font-medium rounded-xs transition-colors"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                      <Link
                        href="/access"
                        className="inline-flex items-center min-h-[42px] px-4 py-2 bg-surface-muted hover:bg-surface text-foreground border border-[color:var(--color-border-strong)] text-xs font-medium rounded-xs transition-colors"
                      >
                        See 2F Staircase Entrance Photo
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bilingual card to show station staff or taxi driver */}
            <div className="ledger-double-frame p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-urushi mb-1.5">
                <Train className="w-4 h-4" aria-hidden="true" />
                <span>Show this card to station staff or a taxi driver</span>
              </div>
              <p className="font-serif text-base sm:text-lg font-bold text-foreground" translate="no">
                発酵と味噌と麺 みつか坊主（エアポートセンタービル 2階）
              </p>
              <p className="text-xs sm:text-sm text-foreground-soft mt-1" translate="no">
                {siteConfig.contact.addressJa}（阪急・大阪モノレール「蛍池駅」東口より徒歩1分・1階バーガーキング横の階段から2階へ）
              </p>
            </div>
          </div>

          {/* Right: Google Map */}
          <div className="lg:col-span-6 min-h-[380px] lg:min-h-full ledger-frame overflow-hidden">
            <iframe
              src={accessInfo.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mitsukabose location on Google Maps"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
