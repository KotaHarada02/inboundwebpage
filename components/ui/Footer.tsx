import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { HiGlobeAlt } from 'react-icons/hi';
import { MapPin, Phone, Clock, Train } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const FOOTER_LINKS = [
  { href: '/', label: 'Home', ja: 'トップ' },
  { href: '/menu', label: 'Menu', ja: 'お品書き' },
  { href: '/food-and-drinks', label: 'Craft & Sake', ja: '醸造と料理' },
  { href: '/events', label: 'Visit Perks', ja: '来店特典' },
  { href: '/access', label: 'Access', ja: 'アクセス' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-kasshoku-deep text-washi border-t-2 border-urushi mt-20"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Restaurant information and site links
      </h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-washi/15">
          {/* Column 1: Identity & Social */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <p className="font-serif text-2xl font-bold tracking-wider text-washi" translate="no">
                MITSUKABOSE
              </p>
              <p className="font-serif text-sm text-kohaku-soft mt-1" translate="no">
                {siteConfig.japaneseName}
              </p>
            </div>
            <p className="text-sm text-washi/80 leading-relaxed">
              Fermented white-miso ramen, Nose natural-farming sake (Akishika), and Osaka craft
              beer (Minoh &amp; Orizé) on the 2nd floor at Hotarugaike Station. Walk-ins welcome;
              no reservations required.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xs border border-washi/20 text-washi hover:border-kohaku-soft hover:text-kohaku-soft transition-colors text-xs"
                aria-label="Mitsukabose on Instagram"
              >
                <FaInstagram className="h-4 w-4" aria-hidden="true" />
                <span>Instagram</span>
              </Link>
              <Link
                href={siteConfig.links.official}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xs border border-washi/20 text-washi hover:border-kohaku-soft hover:text-kohaku-soft transition-colors text-xs"
                aria-label="Mitsukabose Japanese official website"
              >
                <HiGlobeAlt className="h-4 w-4" aria-hidden="true" />
                <span>Official Site (JP)</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Hours & Location */}
          <address className="not-italic md:col-span-5 space-y-4">
            <h3 className="font-serif text-base font-medium text-kohaku-soft">
              Location &amp; Operating Hours
            </h3>
            <ul className="space-y-3 text-sm text-washi/85">
              <li className="flex items-start gap-3">
                <Train className="h-4 w-4 mt-1 text-kohaku-soft flex-none" aria-hidden="true" />
                <div>
                  <p className="font-medium text-washi">{siteConfig.contact.nearestStation}</p>
                  <p className="text-xs text-washi/70 mt-0.5">{siteConfig.contact.airportAccess}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-kohaku-soft flex-none" aria-hidden="true" />
                <div>
                  <p>{siteConfig.contact.address}</p>
                  <p className="text-xs text-washi/70 mt-0.5">{siteConfig.contact.addressJa}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-kohaku-soft flex-none" aria-hidden="true" />
                <div className="font-tabular text-xs sm:text-sm space-y-0.5">
                  <p>Wed–Sat: {siteConfig.hours.wedToSat}</p>
                  <p>Sun: {siteConfig.hours.sunday}</p>
                  <p className="text-washi/65">Closed {siteConfig.hours.closed}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-kohaku-soft flex-none" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                  className="font-tabular text-washi hover:text-kohaku-soft underline underline-offset-4 transition-colors"
                >
                  {siteConfig.telephone}
                </a>
              </li>
            </ul>
          </address>

          {/* Column 3: Navigation */}
          <nav className="md:col-span-3" aria-label="Footer navigation">
            <h3 className="font-serif text-base font-medium text-kohaku-soft mb-4">
              Pages
            </h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-baseline justify-between w-full py-1.5 text-washi/85 hover:text-kohaku-soft transition-colors border-b border-washi/10"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-washi/60">{item.ja}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-washi/65">
          <p>© {year} Mitsukabose (みつか坊主). All rights reserved.</p>
          <p>2F Airport Center Bldg., Hotarugaike, Toyonaka, Osaka 560-0032</p>
        </div>
      </div>
    </footer>
  );
}
