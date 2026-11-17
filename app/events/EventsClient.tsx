import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';
import { Gift, Star, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function EventsClient() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Page Header */}
      <header className="border-b border-[color:var(--color-border-strong)] bg-surface pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
              Visitor &amp; Reviewer Perks
            </h1>
            <span className="font-serif text-lg text-foreground-soft" translate="no">
              ご来店・口コミ特典
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground-soft measure-prose leading-relaxed">
            Thank you for finding Mitsukabose before your visit. When you dine with us in
            Hotarugaike, simply show either of the bilingual cards below to our staff to receive
            a thank-you gift at the table.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
        {/* Two Perk Ledger Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Perk 1: Website Visitor Sticker */}
          <article className="ledger-frame bg-surface-elevated p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] pb-4">
                <div>
                  <p className="text-xs font-medium text-urushi mb-1">
                    Perk 1 · For Every Website Visitor
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    Original Mitsukabose Sticker
                  </h2>
                </div>
                <div className="w-11 h-11 rounded-xs bg-urushi/10 border border-urushi/25 flex items-center justify-center flex-none">
                  <Gift className="w-5 h-5 text-urushi" aria-hidden="true" />
                </div>
              </div>

              <p className="text-sm sm:text-base text-foreground-soft leading-relaxed">
                Visited this website before coming to Hotarugaike? Mention it to our staff—or
                simply show the Japanese card below when ordering—and we will hand you an original
                Mitsukabose sticker.
              </p>

              <ol className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none mt-1" aria-hidden="true" />
                  <span>Order any bowl of ramen or food item for dine-in.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none mt-1" aria-hidden="true" />
                  <span>Show the box below to any staff member at your table or the register.</span>
                </li>
              </ol>
            </div>

            {/* Bilingual Show-to-Staff Card */}
            <div className="ledger-double-frame p-4 sm:p-5 bg-surface">
              <p className="text-[11px] font-medium text-urushi mb-1">
                Show this screen to our staff (スタッフ提示用)
              </p>
              <p className="font-serif text-base sm:text-lg font-bold text-foreground" translate="no">
                「公式インバウンドWEBサイトを見て来店しました」
              </p>
              <p className="text-xs text-foreground-soft mt-1" translate="no">
                スタッフへ：WEBサイト来訪特典のオリジナルステッカーを1枚お渡しください。
              </p>
            </div>
          </article>

          {/* Perk 2: Google Review Miso Sample */}
          <article className="ledger-frame bg-surface-elevated p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] pb-4">
                <div>
                  <p className="text-xs font-medium text-urushi mb-1">
                    Perk 2 · For Sharing Your Experience
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    Take-Home Miso Sample
                  </h2>
                </div>
                <div className="w-11 h-11 rounded-xs bg-kohaku/15 border border-kohaku/30 flex items-center justify-center flex-none">
                  <Star className="w-5 h-5 text-kohaku" aria-hidden="true" />
                </div>
              </div>

              <p className="text-sm sm:text-base text-foreground-soft leading-relaxed">
                Honest notes from travelers help future guests find our 2nd-floor dining hall.
                Post a Google Maps review during your visit and show the screen to our staff to
                receive a sample of our regional miso.
              </p>

              <ol className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none mt-1" aria-hidden="true" />
                  <span>
                    <a
                      href={siteConfig.links.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline font-medium inline-flex items-center gap-1"
                    >
                      <span>Open Mitsukabose on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>{' '}
                    and post your honest review.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-koji flex-none mt-1" aria-hidden="true" />
                  <span>Show your posted review together with the card below before checkout.</span>
                </li>
              </ol>
            </div>

            {/* Bilingual Show-to-Staff Card */}
            <div className="ledger-double-frame p-4 sm:p-5 bg-surface">
              <p className="text-[11px] font-medium text-urushi mb-1">
                Show this screen + your Google review to staff (スタッフ提示用)
              </p>
              <p className="font-serif text-base sm:text-lg font-bold text-foreground" translate="no">
                「Googleマップの口コミを投稿しました」
              </p>
              <p className="text-xs text-foreground-soft mt-1" translate="no">
                スタッフへ：投稿画面をご確認のうえ、特製味噌サンプルをお渡しください。
              </p>
            </div>
          </article>
        </div>

        {/* Simple, direct terms */}
        <section
          aria-labelledby="perk-notes-heading"
          className="ledger-frame p-6 sm:p-8 bg-surface-muted/60 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <h2 id="perk-notes-heading" className="font-serif text-lg font-bold text-foreground">
              Notes on Visitor Perks
            </h2>
            <ul className="text-xs sm:text-sm text-foreground-soft space-y-1">
              <li>• Valid for dine-in guests at Mitsukabose Hotarugaike (one gift per guest per visit).</li>
              <li>• Gifts are prepared in limited batches and may vary depending on seasonal stock.</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-urushi hover:bg-urushi-deep text-washi text-xs sm:text-sm font-medium rounded-xs transition-colors"
            >
              Browse Full Menu
            </Link>
            <Link
              href="/access"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-surface-elevated hover:bg-surface text-foreground border border-[color:var(--color-border-strong)] text-xs sm:text-sm font-medium rounded-xs transition-colors"
            >
              Station Route &amp; Hours
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
