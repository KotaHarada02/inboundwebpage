'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, MapPin, Clock } from 'lucide-react';
import { useSidebar } from '@/contexts/use-sidebar';
import { getStoreStatus, type StoreStatus } from '@/lib/menuUtils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', ja: 'トップ' },
  { href: '/menu', label: 'Menu', ja: 'お品書き' },
  { href: '/food-and-drinks', label: 'Craft & Sake', ja: '醸造と料理' },
  { href: '/events', label: 'Visit Perks', ja: '来店特典' },
  { href: '/access', label: 'Access', ja: '駅1分・道順' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    setStatus(getStoreStatus(new Date()));
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur-md border-b border-[color:var(--color-border-strong)]"
      aria-label="Primary navigation"
    >
      {/* Top chalkboard station & live status strip */}
      <div className="bg-kasshoku-deep text-washi border-b border-washi/15 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-washi/90">
            <MapPin className="w-3.5 h-3.5 text-kohaku-soft flex-none" aria-hidden="true" />
            <span>
              <strong>Hotarugaike Stn</strong> East Exit <span className="font-tabular">1 min</span>
              <span className="hidden sm:inline text-washi/70">
                {' '}· Osaka Itami Airport (ITM) <span className="font-tabular">3 min</span> by Monorail
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-tabular text-[11px] sm:text-xs">
            <Clock className="w-3.5 h-3.5 text-kohaku-soft flex-none" aria-hidden="true" />
            {status ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status.isOpen ? 'bg-kohaku-soft' : 'bg-washi/40'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-washi font-medium">{status.label}</span>
                <span className="hidden md:inline text-washi/70">({status.detail})</span>
              </span>
            ) : (
              <span className="text-washi/85">
                Wed–Sat 11:30–24:00 · Sun 11:30–22:00 · Closed Mon &amp; Tue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu toggle (min 44x44px) */}
          <button
            type="button"
            onClick={toggle}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xs text-foreground hover:text-urushi hover:bg-surface-muted transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Brand identity — no artificial single-letter coloring */}
          <Link
            href="/"
            className="flex items-baseline gap-3 py-2 select-none group"
            aria-label="Mitsukabose (みつか坊主) Home"
          >
            <span
              className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-foreground group-hover:text-urushi transition-colors"
              translate="no"
            >
              MITSUKABOSE
            </span>
            <span
              className="font-serif text-sm sm:text-base text-foreground-soft border-l border-[color:var(--color-border-strong)] pl-3"
              translate="no"
            >
              みつか坊主
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative inline-flex items-baseline gap-1.5 min-h-[44px] px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'text-urushi'
                      : 'text-foreground hover:text-urushi hover:bg-surface-muted/60'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] font-normal text-muted">{item.ja}</span>
                  {active && (
                    <span
                      className="absolute left-3 right-3 bottom-0 h-0.5 bg-urushi"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick CTA on desktop / mobile right slot */}
          <div className="flex items-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center min-h-[40px] sm:min-h-[42px] px-3.5 sm:px-4 py-2 bg-urushi hover:bg-urushi-deep text-washi text-xs sm:text-sm font-medium rounded-xs transition-colors"
            >
              Menu · お品書き
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
