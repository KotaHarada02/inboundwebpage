import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export default function EventsClient() {
  return (
    <div className="min-h-screen bg-surface pb-16">
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-b border-[color:var(--color-border)]">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          来店特典 <span className="text-lg sm:text-xl font-normal text-muted ml-1">Visitor Gifts</span>
        </h1>
        <p className="text-sm text-foreground-soft mt-2 leading-relaxed">
          Show this page to our staff when ordering in Hotarugaike.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 divide-y divide-[color:var(--color-border)]">
        {/* Gift 1 */}
        <section className="py-8 space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Original Sticker
            </h2>
            <span className="text-xs text-urushi font-medium">Website Visitor Gift</span>
          </div>
          <p className="text-sm text-foreground-soft leading-relaxed">
            Visited our website before coming in? Show the Japanese message below to any staff
            member when ordering to receive a free Mitsukabose sticker.
          </p>
          <div className="p-4 bg-surface-muted text-foreground">
            <p className="text-[11px] text-muted mb-1">Show to staff / スタッフ提示用</p>
            <p className="font-serif text-base sm:text-lg font-bold" translate="no">
              WEBサイトを見て来店しました（ステッカー特典）
            </p>
          </div>
        </section>

        {/* Gift 2 */}
        <section className="py-8 space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Regional Miso Sample
            </h2>
            <span className="text-xs text-urushi font-medium">Google Maps Review Gift</span>
          </div>
          <p className="text-sm text-foreground-soft leading-relaxed">
            Share an honest review on{' '}
            <a
              href={siteConfig.links.map}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4"
            >
              Google Maps
            </a>{' '}
            and show your screen to our staff before checkout to receive a sample of our miso.
          </p>
          <div className="p-4 bg-surface-muted text-foreground">
            <p className="text-[11px] text-muted mb-1">Show to staff / スタッフ提示用</p>
            <p className="font-serif text-base sm:text-lg font-bold" translate="no">
              Googleマップの口コミを投稿しました（味噌サンプル特典）
            </p>
          </div>
        </section>

        {/* Footer note */}
        <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted">
          <p>One gift per dine-in guest per visit, while seasonal stock lasts.</p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 bg-foreground text-surface text-xs font-medium rounded-full self-start"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
