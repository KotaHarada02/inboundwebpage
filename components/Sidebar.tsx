'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin, Clock, Phone } from 'lucide-react';
import { useSidebar } from '@/contexts/use-sidebar';
import { siteConfig } from '@/lib/siteConfig';

const navigationItems = [
  { name: 'Home', href: '/', ja: 'トップページ' },
  { name: 'Menu', href: '/menu', ja: 'お品書き（時間帯・食習慣別）' },
  { name: 'Craft & Sake', href: '/food-and-drinks', ja: '箕面ビール・オリゼー・秋鹿・味噌' },
  { name: 'Visit Perks', href: '/events', ja: '来店ステッカー・レビュー特典' },
  { name: 'Access', href: '/access', ja: '蛍池駅東口徒歩1分・2階入口案内' },
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
      if (window.innerWidth >= 1024) close();
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
            className="fixed inset-0 bg-kasshoku-deep/65 z-50 lg:hidden"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 h-full w-[310px] sm:w-[350px] bg-surface z-50 lg:hidden border-r border-[color:var(--color-border-strong)] overscroll-contain flex flex-col"
            style={{ boxShadow: 'var(--shadow-floating)' }}
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-[color:var(--color-border-strong)] flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-bold text-foreground" translate="no">
                  MITSUKABOSE
                </p>
                <p className="font-serif text-xs text-foreground-soft" translate="no">
                  発酵と味噌と麺 みつか坊主
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation menu"
                className="inline-flex items-center justify-center w-11 h-11 rounded-xs text-foreground hover:text-urushi hover:bg-surface-muted transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
              <ul className="space-y-1.5">
                {navigationItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className={`flex flex-col justify-center min-h-[52px] py-2.5 px-3.5 rounded-xs border transition-colors ${
                          active
                            ? 'bg-surface-muted border-[color:var(--color-border-strong)] text-urushi'
                            : 'border-transparent text-foreground hover:bg-surface-muted hover:text-urushi'
                        }`}
                      >
                        <span className="font-serif text-base font-medium">
                          {item.name}
                        </span>
                        <span className="text-xs text-foreground-soft mt-0.5">
                          {item.ja}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Quick station & hours summary in drawer */}
            <div className="p-5 bg-surface-muted border-t border-[color:var(--color-border-strong)] space-y-2.5 text-xs text-foreground-soft">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-urushi flex-none mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Hotarugaike Stn East Exit · 1 min</p>
                  <p>{siteConfig.contact.addressJa}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-urushi flex-none mt-0.5" aria-hidden="true" />
                <div className="font-tabular">
                  <p>Wed–Sat: {siteConfig.hours.wedToSat}</p>
                  <p>Sun: {siteConfig.hours.sunday}</p>
                  <p className="text-muted">Closed {siteConfig.hours.closed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-urushi flex-none" aria-hidden="true" />
                <a
                  href={`tel:${siteConfig.telephone.replace(/[^+\d]/g, '')}`}
                  className="font-tabular link-underline text-foreground font-medium"
                >
                  {siteConfig.telephone}
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
