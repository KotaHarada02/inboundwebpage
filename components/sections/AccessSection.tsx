import Link from 'next/link';
import { getAccessInfo } from '@/domain/services/dataService';
import { siteConfig } from '@/lib/siteConfig';

export default function AccessSection() {
  const accessInfo = getAccessInfo();

  return (
    <section
      id="access"
      aria-labelledby="access-heading"
      className="py-12 sm:py-16 bg-surface"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="access-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-foreground"
            >
              Access &amp; Hours
            </h2>
            <p className="text-xs sm:text-sm text-foreground-soft mt-1">
              1-minute walk from Hotarugaike Station East Exit · 1 stop (3 min) from Osaka Itami Airport (ITM)
            </p>
          </div>
          <Link
            href="/access"
            className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:text-urushi"
          >
            2F entrance photo &amp; step-by-step route
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Clean unboxed schedule & address */}
          <div className="md:col-span-5 space-y-6 text-sm">
            <dl className="divide-y divide-[color:var(--color-border)] border-y border-[color:var(--color-border)]">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-foreground-soft">Wed – Sat</dt>
                <dd className="font-tabular font-medium text-foreground">
                  11:30–24:00 <span className="text-xs text-muted">(LO 23:30)</span>
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-foreground-soft">Sunday</dt>
                <dd className="font-tabular font-medium text-foreground">
                  11:30–22:00 <span className="text-xs text-muted">(LO 21:30)</span>
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-muted">Closed</dt>
                <dd className="text-muted">Monday &amp; Tuesday</dd>
              </div>
            </dl>

            <div className="space-y-1.5">
              <p className="font-medium text-foreground">{siteConfig.contact.address}</p>
              <p className="text-xs text-muted" translate="no">
                {siteConfig.contact.addressJa}（阪急・モノレール「蛍池駅」東口 徒歩1分・バーガーキング左隣の階段より2F）
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={siteConfig.links.map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 bg-foreground text-surface text-xs font-medium rounded-full"
              >
                Open Google Maps
              </a>
              <Link
                href="/access"
                className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 border border-[color:var(--color-border-strong)] text-foreground text-xs font-medium rounded-full"
              >
                See 2F Entrance Photo
              </Link>
            </div>
          </div>

          {/* Right: Map */}
          <div className="md:col-span-7 h-[300px] sm:h-[340px] bg-surface-muted overflow-hidden">
            <iframe
              src={accessInfo.mapUrl}
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
    </section>
  );
}
