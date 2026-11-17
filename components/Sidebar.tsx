'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '@/contexts/use-sidebar';
import { siteConfig } from '@/lib/siteConfig';

const navigationItems = [
  { name: 'Home', href: '/', ja: 'トップ' },
  { name: 'Menu', href: '/menu', ja: 'お品書き' },
  { name: 'Brewers & Food', href: '/food-and-drinks', ja: '醸造所と料理' },
  { name: 'Visitor Gifts', href: '/events', ja: 'ステッカー・味噌特典' },
  { name: 'Access', href: '/access', ja: '蛍池駅 徒歩1分・営業時間' },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) close();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted, close]);

  useEffect(() => {
    if (!isMounted || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, isOpen, close]);

  useEffect(() => {
    if (!isMounted) return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMounted]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 bg-kasshoku-deep/50 z-50 md:hidden"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 bg-surface z-50 md:hidden border-b border-[color:var(--color-border-strong)] overscroll-contain flex flex-col"
          >
            <div className="px-4 h-14 border-b border-[color:var(--color-border)] flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-foreground" translate="no">
                みつか坊主 <span className="text-xs font-sans font-normal text-muted ml-1">Mitsukabose</span>
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="min-w-[44px] min-h-[44px] px-2 text-xs font-medium uppercase tracking-wider text-foreground"
              >
                Close
              </button>
            </div>

            <nav className="px-4 py-4" aria-label="Mobile">
              <ul className="divide-y divide-[color:var(--color-border)]">
                {navigationItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-baseline justify-between py-3.5 transition-colors ${
                          active ? 'text-urushi font-semibold' : 'text-foreground'
                        }`}
                      >
                        <span className="font-serif text-xl">{item.name}</span>
                        <span className="text-xs text-muted">{item.ja}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="px-4 py-4 bg-surface-muted text-xs text-foreground-soft flex flex-wrap items-center justify-between gap-2">
              <span>Hotarugaike Stn East Exit 1 min (2F)</span>
              <span className="font-tabular">Wed–Sat 11:30–24:00 · Sun –22:00</span>
              <a
                href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                className="font-tabular text-foreground underline"
              >
                {siteConfig.telephone}
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
