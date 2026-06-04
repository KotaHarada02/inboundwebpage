'use client';

import { ReactNode } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { SidebarProvider } from '@/contexts/use-sidebar';
import Sidebar from '@/components/Sidebar';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ParallaxProvider>
      <SidebarProvider>
        {children}
        <Sidebar />
      </SidebarProvider>
    </ParallaxProvider>
  );
}
