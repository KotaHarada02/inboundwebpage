'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSidebar } from '@/contexts/use-sidebar';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/food-and-drinks', label: 'Food & Drinks' },
  { href: '/events', label: 'Events' },
  { href: '/access', label: 'Access' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'glass shadow-[0_4px_30px_-12px_rgba(31,26,20,0.18)] border-b border-[color:var(--glass-border)]'
          : 'bg-transparent border-b border-transparent'
      }`}
      aria-label="Primary navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="lg:hidden p-2 rounded-md text-foreground hover:text-shibu-aka hover:bg-background-soft transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Brand */}
          <Link
            href="/"
            className="flex flex-col items-center font-serif leading-none select-none"
            aria-label="Mitsukabose home"
          >
            <span className="text-[10px] tracking-[0.4em] text-muted uppercase">
              Fermented Miso Ramen
            </span>
            <span className="text-xl md:text-2xl font-light tracking-[0.25em] text-foreground mt-1">
              <span className="text-shibu-aka">MI</span>TSUKA{' '}
              <span className="text-shibu-aka">B</span>OSE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                  isActive(item.href)
                    ? 'text-shibu-aka'
                    : 'text-foreground-soft hover:text-shibu-aka'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="headerActive"
                    className="absolute left-3 right-3 -bottom-0.5 h-px bg-shibu-aka"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile spacer */}
          <div className="w-10 lg:hidden" aria-hidden="true" />
        </div>
      </div>
    </motion.header>
  );
}
