import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { HiGlobeAlt } from 'react-icons/hi';
import { MapPin, Phone, Clock } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative bg-kasshoku-deep text-washi mt-24"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Top decorative gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-kohaku to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand block */}
          <div>
            <p className="font-serif text-xl tracking-[0.25em] text-washi mb-3">
              MITSUKA BOSE
            </p>
            <p className="text-sm text-washi/70 leading-relaxed mb-4">
              A fermentation-driven miso ramen &amp; craft beer house in
              Hotarugaike, Toyonaka, Osaka.
            </p>
            <div className="flex gap-4">
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-washi/80 hover:text-kohaku transition-colors"
                aria-label="Mitsukabose on Instagram"
              >
                <FaInstagram className="h-7 w-7" />
              </Link>
              <Link
                href={siteConfig.links.official}
                target="_blank"
                rel="noopener noreferrer"
                className="text-washi/80 hover:text-kohaku transition-colors"
                aria-label="Mitsukabose official website"
              >
                <HiGlobeAlt className="h-7 w-7" />
              </Link>
            </div>
          </div>

          {/* Visit block */}
          <address className="not-italic">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-kohaku-soft mb-4">
              Visit
            </p>
            <ul className="space-y-3 text-sm text-washi/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-kohaku flex-none" aria-hidden="true" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-kohaku flex-none" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                  className="link-underline hover:text-kohaku transition-colors"
                >
                  {siteConfig.telephone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-kohaku flex-none" aria-hidden="true" />
                <span>
                  Wed–Sat 11:30–24:00 / Sun 11:30–22:00
                  <br />
                  <span className="text-washi/60">Closed Mon &amp; Tue</span>
                </span>
              </li>
            </ul>
          </address>

          {/* Sitemap block */}
          <nav aria-label="Footer">
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-kohaku-soft mb-4">
              Explore
            </p>
            <ul className="grid grid-cols-2 gap-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Menu' },
                { href: '/food-and-drinks', label: 'Food &amp; Drinks' },
                { href: '/ramen', label: 'Ramen' },
                { href: '/events', label: 'Events' },
                { href: '/access', label: 'Access' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-washi/80 hover:text-kohaku transition-colors"
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-washi/10 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-washi/50">
          <p>© {year} Mitsukabōzu. All rights reserved.</p>
          <p className="tracking-widest uppercase">Crafted with fermentation &amp; care.</p>
        </div>
      </div>
    </footer>
  );
}
