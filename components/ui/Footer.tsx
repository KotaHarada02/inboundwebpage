import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/food-and-drinks', label: 'Brewers & Food' },
  { href: '/events', label: 'Gifts' },
  { href: '/access', label: 'Access' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-kasshoku-deep text-washi mt-16"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Restaurant information and links
      </h2>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-washi/15">
          <div>
            <p className="font-serif text-2xl font-bold text-washi" translate="no">
              発酵と味噌と麺 みつか坊主
            </p>
            <p className="text-xs tracking-[0.15em] uppercase text-washi/65 mt-1" translate="no">
              Mitsukabose · Hotarugaike, Osaka
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-washi/80 hover:text-washi transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm text-washi/75">
          <div className="space-y-1.5">
            <p className="text-washi font-medium">2F Airport Center Bldg., 1-6-5 Hotarugaike Higashimachi</p>
            <p>Toyonaka, Osaka 560-0032 (1-min walk from Hotarugaike Stn East Exit)</p>
            <p className="text-washi/55" translate="no">{siteConfig.contact.addressJa}</p>
          </div>

          <div className="space-y-1.5 sm:text-right font-tabular">
            <p>Wed–Sat 11:30–24:00 (LO 23:30) / Sun 11:30–22:00 (LO 21:30)</p>
            <p className="text-washi/55">Closed Monday &amp; Tuesday · Walk-ins only</p>
            <p className="pt-1">
              <a
                href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                className="text-washi underline underline-offset-4 mr-4"
              >
                {siteConfig.telephone}
              </a>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-washi underline underline-offset-4"
              >
                Instagram
              </a>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-washi/10 text-[11px] text-washi/45 flex justify-between">
          <span>© {year} Mitsukabose</span>
          <span>Osaka Monorail · 1 stop from Itami Airport (ITM)</span>
        </div>
      </div>
    </footer>
  );
}
