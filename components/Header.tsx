'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/use-sidebar';

const NAV_ITEMS = [
  { href: '/menu', label: 'Menu' },
  { href: '/food-and-drinks', label: 'Brewers & Food' },
  { href: '/events', label: 'Gifts' },
  { href: '/access', label: 'Access' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-[color:var(--color-border)]"
      aria-label="Primary navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-baseline gap-2.5 py-2 select-none"
            aria-label="Mitsukabose Home"
          >
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-foreground" translate="no">
              みつか坊主
            </span>
            <span className="text-xs tracking-[0.14em] text-foreground-soft uppercase" translate="no">
              Mitsukabose
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`py-2 text-sm transition-colors ${
                    active
                      ? 'text-foreground font-semibold underline decoration-urushi decoration-2 underline-offset-8'
                      : 'text-foreground-soft hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile right controls: quick Menu link + minimal text/line trigger */}
          <div className="flex md:hidden items-center gap-2">
            {pathname !== '/menu' && (
              <Link
                href="/menu"
                className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 bg-foreground text-surface text-xs font-medium rounded-full"
              >
                Menu
              </Link>
            )}
            <button
              type="button"
              onClick={toggle}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-drawer"
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-2 text-xs font-medium tracking-wider uppercase text-foreground"
            >
              {isOpen ? 'Close' : 'Index'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
