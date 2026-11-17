import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';

const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.4277464384927!2d135.44954909999998!3d34.7951789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f077fa0f081f%3A0x41a2ef4a75848277!2z55m66YW144Go5ZGz5ZmM44Go6bq6IOOBv-OBpOOBi-WdiuS4uw!5e0!3m2!1sja!2sjp!4v1757148904874!5m2!1sja!2sjp';

export default function AccessClient() {
  return (
    <div className="min-h-screen bg-surface pb-16">
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-b border-[color:var(--color-border)]">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          アクセス <span className="text-lg sm:text-xl font-normal text-muted ml-1">Access</span>
        </h1>
        <p className="text-sm text-foreground-soft mt-1.5">
          1-minute walk from Hotarugaike Station East Exit · 1 stop (3 min) from Osaka Itami Airport (ITM)
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {/* Hours & Address */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 space-y-6 text-sm">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground mb-3">Hours</h2>
              <dl className="divide-y divide-[color:var(--color-border)] border-y border-[color:var(--color-border)]">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-foreground-soft">Wed – Sat</dt>
                  <dd className="font-tabular font-medium text-foreground">11:30–24:00 (LO 23:30)</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-foreground-soft">Sunday</dt>
                  <dd className="font-tabular font-medium text-foreground">11:30–22:00 (LO 21:30)</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-muted">Closed</dt>
                  <dd className="text-muted">Monday &amp; Tuesday</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-foreground">Address</h2>
              <p className="text-foreground-soft leading-relaxed">{siteConfig.contact.address}</p>
              <div className="p-4 bg-surface-muted text-foreground mt-2">
                <p className="text-[11px] text-muted mb-1">Show to taxi or station staff / 提示用</p>
                <p className="font-serif text-base font-bold" translate="no">
                  発酵と味噌と麺 みつか坊主（エアポートセンタービル 2F）
                </p>
                <p className="text-xs text-foreground-soft mt-1" translate="no">
                  {siteConfig.contact.addressJa}（蛍池駅東口 徒歩1分・1階バーガーキング左隣の暖簾・階段より2階へ）
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={siteConfig.links.map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 bg-foreground text-surface text-xs font-medium rounded-full"
              >
                Open in Google Maps
              </a>
              <a
                href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 border border-[color:var(--color-border-strong)] text-foreground font-tabular text-xs rounded-full"
              >
                {siteConfig.telephone}
              </a>
            </div>
          </div>

          {/* 2F Entrance Photo */}
          <figure className="md:col-span-6 space-y-2">
            <div className="relative aspect-[3/4] w-full bg-surface-muted overflow-hidden">
              <Image
                src="/images/access/store-front.jpg"
                alt="Street view of the ground-floor staircase entrance to Mitsukabose on the left of Burger King"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-bottom"
              />
            </div>
            <figcaption className="text-xs text-muted leading-relaxed">
              Exit Hotarugaike East Gate: our staircase entrance is on the left side of the Airport
              Center Building (next to Burger King). Walk up to the 2nd floor.
            </figcaption>
          </figure>
        </div>

        {/* Google Map */}
        <div className="h-[340px] sm:h-[400px] bg-surface-muted overflow-hidden">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mitsukabose location on Google Maps"
          />
        </div>
      </div>
    </div>
  );
}
