'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/contexts/use-sidebar';

const navigationItems = [
  { name: 'Home', href: '/', ja: 'ホーム' },
  { name: 'Menu', href: '/menu', ja: 'メニュー' },
  { name: 'Food & Drinks', href: '/food-and-drinks', ja: '料理と飲み物' },
  { name: 'Events', href: '/events', ja: 'イベント' },
  { name: 'Access', href: '/access', ja: 'アクセス' },
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

  // Lock body scroll while drawer is open
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
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 bg-kasshoku-deep/60 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 h-full w-[300px] sm:w-[340px] bg-background z-50 lg:hidden shadow-cinematic"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col h-full">
              <div className="px-6 pt-20 pb-6 border-b border-kasshoku/10">
                <p className="text-[10px] tracking-[0.4em] text-muted uppercase mb-2">
                  Fermented Miso Ramen
                </p>
                <p className="font-serif text-xl tracking-[0.2em] text-foreground">
                  MITSUKA BOSE
                </p>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
                <ul className="space-y-2">
                  {navigationItems.map((item, idx) => {
                    const active = isActive(item.href);
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={close}
                          className={`group flex items-baseline justify-between py-3 px-3 rounded-md transition-all ${
                            active
                              ? 'bg-background-soft text-shibu-aka'
                              : 'text-foreground hover:bg-background-soft hover:text-shibu-aka'
                          }`}
                        >
                          <span className="font-serif text-lg tracking-wide">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted group-hover:text-shibu-aka transition-colors">
                            {item.ja}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="px-6 py-6 border-t border-kasshoku/10 text-xs text-muted">
                <p>2F Airport Center Bldg., Hotarugaike</p>
                <p>Toyonaka, Osaka</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
