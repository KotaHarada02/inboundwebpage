import type { Metadata } from 'next';
import Link from 'next/link';
import { DishMediaFrame } from '@/components/ui/DishMediaFrame';

export const metadata: Metadata = {
  title: 'Design System & Component Ledger',
  description: 'Internal styleguide verifying tokens, typography, controls, and media states for Mitsukabose.',
  robots: { index: false, follow: false },
};

const COLOR_SWATCHES = [
  {
    name: 'Shikkui White (白漆喰)',
    token: '--color-surface',
    hex: '#F6F2EA',
    usage: 'Primary page ground — troweled plaster wall in daylight',
    bgClass: 'bg-surface',
    textClass: 'text-foreground',
  },
  {
    name: 'Mortar Sand (土間モルタル)',
    token: '--color-surface-muted',
    hex: '#EBE4D6',
    usage: 'Secondary section ground & placeholder frame surface',
    bgClass: 'bg-surface-muted',
    textClass: 'text-foreground',
  },
  {
    name: 'Kurotetsu Ink (黒鉄墨)',
    token: '--color-text / --color-surface-chalkboard',
    hex: '#1A1714',
    usage: 'Primary text (15.2:1 contrast), steel window grid, chalkboard bar',
    bgClass: 'bg-kasshoku-deep',
    textClass: 'text-washi',
  },
  {
    name: 'Susudake Wood (古材煤竹)',
    token: '--color-text-secondary',
    hex: '#4E4237',
    usage: 'Body prose & communal wooden table tone (8.4:1 contrast)',
    bgClass: 'bg-kasshoku',
    textClass: 'text-washi',
  },
  {
    name: 'Shu-Urushi (朱漆)',
    token: '--color-action',
    hex: '#A32C1E',
    usage: 'Primary action button & signature bowl accent (6.1:1 with Shikkui)',
    bgClass: 'bg-urushi',
    textClass: 'text-washi',
  },
  {
    name: 'Mugi Kohaku (麦琥珀)',
    token: '--color-highlight',
    hex: '#B86B19',
    usage: 'Craft beer amber accent on dark chalkboard surfaces',
    bgClass: 'bg-kohaku',
    textClass: 'text-washi',
  },
  {
    name: 'Koji Moss (麹葉)',
    token: '--color-dietary',
    hex: '#285938',
    usage: 'Vegan, Vegetarian & plant-based dietary indicators',
    bgClass: 'bg-koji',
    textClass: 'text-washi',
  },
];

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-surface py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <header className="border-b border-[color:var(--color-border-strong)] pb-8">
          <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
            Mitsukabose Design System Ledger
          </h1>
          <p className="text-foreground-soft measure-prose text-lg">
            Visual world: <strong>2F Hotarugaike Fermentation Hall &amp; Brew Ledger</strong>.
            Built from troweled shikkui plaster, arched steel window frames, antique wood tables,
            and vermilion lacquer ramen bowls.
          </p>
        </header>

        {/* 1. Color Tokens */}
        <section aria-labelledby="sg-colors">
          <h2 id="sg-colors" className="font-serif text-2xl sm:text-3xl text-foreground mb-6">
            1. Color Tokens (OKLCH / Semantic Palette)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLOR_SWATCHES.map((swatch) => (
              <div key={swatch.name} className="ledger-frame overflow-hidden flex flex-col">
                <div className={`h-24 p-4 flex items-end justify-between ${swatch.bgClass} ${swatch.textClass}`}>
                  <span className="font-tabular text-xs">{swatch.hex}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base text-foreground font-medium">{swatch.name}</h3>
                    <p className="font-tabular text-xs text-muted mt-0.5">{swatch.token}</p>
                  </div>
                  <p className="text-xs text-foreground-soft mt-3 leading-relaxed">{swatch.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section aria-labelledby="sg-type">
          <h2 id="sg-type" className="font-serif text-2xl sm:text-3xl text-foreground mb-6">
            2. Typography &amp; Measure
          </h2>
          <div className="ledger-frame p-6 sm:p-8 space-y-8">
            <div className="border-b border-[color:var(--color-border)] pb-6">
              <p className="font-tabular text-xs text-muted mb-2">
                Display Heading — Shippori Mincho 500/700 (font-serif)
              </p>
              <p className="font-serif text-4xl sm:text-5xl text-foreground leading-tight">
                Slow-Brewed White Miso Ramen &amp; Osaka Craft Beer
              </p>
              <p className="font-serif text-2xl text-foreground-soft mt-2">
                発酵と味噌と麺 みつか坊主 — 蛍池駅東口 徒歩1分
              </p>
            </div>

            <div className="border-b border-[color:var(--color-border)] pb-6">
              <p className="font-tabular text-xs text-muted mb-2">
                Body Copy — Plus Jakarta Sans + Zen Kaku Gothic New (max-width: 68ch, line-height: 1.7)
              </p>
              <p className="text-foreground-soft measure-prose">
                This is the very first miso ramen ever created at Mitsukabose—a bowl that captures
                our origins. The soup is made with a smooth white miso base, gently enriched with
                the comforting aroma of Japanese dashi. Paired with Akishika natural-farming sake
                from Nose Town and unfiltered craft beer from Minoh.
              </p>
            </div>

            <div>
              <p className="font-tabular text-xs text-muted mb-2">
                Tabular Numerals — JetBrains Mono (font-tabular) for Prices, Hours &amp; Walk Time
              </p>
              <div className="max-w-sm space-y-1.5 text-sm">
                <div className="flex justify-between border-b border-dotted border-[color:var(--color-border)] pb-1">
                  <span>Normal Bowl</span>
                  <span className="font-tabular font-medium">¥1,080</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-[color:var(--color-border)] pb-1">
                  <span>With Seasoned Egg (+egg)</span>
                  <span className="font-tabular font-medium">¥1,240</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-[color:var(--color-border)] pb-1">
                  <span>Special All-Topping</span>
                  <span className="font-tabular font-medium">¥1,680</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Controls & States */}
        <section aria-labelledby="sg-controls">
          <h2 id="sg-controls" className="font-serif text-2xl sm:text-3xl text-foreground mb-6">
            3. Buttons, Links &amp; Dietary Badges
          </h2>
          <div className="ledger-frame p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="font-serif text-lg text-foreground mb-4">Action Controls (Min 44×44px target)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-urushi hover:bg-urushi-deep text-washi text-sm font-medium rounded-xs transition-colors"
                >
                  Browse Full Menu by Time Slot
                </Link>
                <Link
                  href="/access"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-surface-elevated hover:bg-surface-muted text-foreground border border-[color:var(--color-border-strong)] text-sm font-medium rounded-xs transition-colors"
                >
                  View 1-Minute Station Route
                </Link>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 bg-surface-muted text-muted border border-[color:var(--color-border)] text-sm font-medium rounded-xs opacity-60 cursor-not-allowed"
                >
                  Midnight Service (Wed–Sat Only)
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg text-foreground mb-4">Dietary &amp; Allergen Badges</h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-koji/12 text-koji border border-koji/30">
                  Vegan
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-koji/12 text-koji border border-koji/30">
                  Vegetarian
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-urushi/10 text-urushi border border-urushi/25">
                  Spicy
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs text-foreground-soft bg-surface-muted border border-[color:var(--color-border)]">
                  Allergens: soy, wheat, egg
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Media Frame States (Real Photo vs Unphotographed Vessel Illustration) */}
        <section aria-labelledby="sg-media">
          <h2 id="sg-media" className="font-serif text-2xl sm:text-3xl text-foreground mb-6">
            4. DishMediaFrame States (Photograph vs. Honest Preparation Frame)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ledger-frame overflow-hidden">
              <DishMediaFrame
                src="/images/menu/white-miso.jpg"
                alt="White Miso Ramen"
                category="Ramen"
                priceBadge="¥500–¥1,680"
              />
              <div className="p-4">
                <h3 className="font-serif text-lg text-foreground">White Miso Ramen (Verified Image)</h3>
                <p className="text-xs text-foreground-soft mt-1">
                  Renders optimized Next.js image with tabular price badge.
                </p>
              </div>
            </div>

            <div className="ledger-frame overflow-hidden">
              <DishMediaFrame
                src="/images/menu/sakekasu-ramen.jpg"
                alt="Sake Kasu Ramen"
                category="Ramen"
                itemName="Sake Kasu Ramen"
                priceBadge="¥1,260"
              />
              <div className="p-4">
                <h3 className="font-serif text-lg text-foreground">Sake Kasu Ramen (Unphotographed)</h3>
                <p className="text-xs text-foreground-soft mt-1">
                  Avoids 400 error and renders a lacquer bowl line drawing while awaiting photography.
                </p>
              </div>
            </div>

            <div className="ledger-frame overflow-hidden">
              <DishMediaFrame
                src="/images/menu/ringo-atsukan.jpg"
                alt="Ringo Warm Sake (Atsukan)"
                category="JapaneseSake"
                itemName="Ringo Warm Sake (Atsukan)"
                priceBadge="¥850"
              />
              <div className="p-4">
                <h3 className="font-serif text-lg text-foreground">Ringo Warm Sake (Unphotographed)</h3>
                <p className="text-xs text-foreground-soft mt-1">
                  Renders tokkuri &amp; ochoko sake vessel illustration matched to category.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
