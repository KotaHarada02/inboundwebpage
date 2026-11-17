'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function OrnamentalDivider({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <div className="w-12 h-px bg-kasshoku/30" />
      <div className="w-1.5 h-1.5 bg-shibu-aka rounded-full" />
      <div className="w-12 h-px bg-kasshoku/30" />
    </div>
  );
}

export interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitleJa?: string;
  description?: React.ReactNode;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  subtitleJa,
  description,
  as: HeadingTag = 'h2',
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${isCenter ? 'text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <p className="text-[10px] tracking-[0.5em] text-kohaku uppercase mb-3 font-light">
          {eyebrow}
        </p>
      )}
      <HeadingTag
        id={id}
        className={`font-serif ${
          HeadingTag === 'h1'
            ? 'text-5xl md:text-6xl'
            : 'text-4xl md:text-5xl'
        } font-light text-foreground tracking-wide`}
      >
        {title}
      </HeadingTag>
      {subtitleJa && (
        <span className="block text-sm text-muted mt-2 tracking-[0.3em] font-light">
          {subtitleJa}
        </span>
      )}
      {description && (
        <p
          className={`text-base sm:text-lg text-foreground-soft font-light leading-relaxed mt-4 ${
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          }`}
        >
          {description}
        </p>
      )}
      {isCenter && <OrnamentalDivider className="mt-6" />}
    </motion.div>
  );
}
