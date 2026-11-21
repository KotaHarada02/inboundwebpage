'use client';

import React from 'react';
import { Info } from 'lucide-react';
import {
  Root as TooltipRoot,
  Trigger as TooltipTrigger,
  Content as TooltipContent,
} from '@radix-ui/react-tooltip';

export type BadgeVariant =
  | 'location'
  | 'ingredient'
  | 'dietary'
  | 'allergen'
  | 'category'
  | 'category-solid'
  | 'price';

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  location:
    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-washi/20 bg-washi/[0.06] backdrop-blur-sm text-[10px] md:text-xs tracking-[0.4em] text-kohaku-soft uppercase font-light',
  // メニューカードで何十回も繰り返されるバリアントは globals.css のコンポーネントクラスにまとめ、
  // 事前描画した /menu の HTML を小さくしている（Worker の CPU 時間対策）
  ingredient: 'badge-ingredient',
  dietary: 'badge-dietary',
  allergen: 'badge-allergen',
  category:
    'inline-block px-2.5 py-1 bg-background text-shibu-aka rounded-sm text-[10px] tracking-[0.3em] uppercase border border-shibu-aka/30',
  'category-solid':
    'inline-block px-3 py-1 bg-shibu-aka text-washi rounded-sm text-[10px] tracking-[0.3em] uppercase',
  price: 'badge-price',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulseDot?: boolean;
}

export function Badge({
  variant = 'ingredient',
  pulseDot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={`${BADGE_VARIANTS[variant]} ${className}`} {...props}>
      {pulseDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-kohaku-soft animate-subtle-pulse"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

const DIETARY_DESCRIPTIONS: Record<string, string> = {
  Vegetarian:
    'Contains no meat, poultry, fish, or seafood, but may contain eggs or dairy',
  Vegan: 'Contains no animal products or by-products whatsoever',
  'Gluten-Free':
    'Contains no wheat, barley, rye, or other gluten-containing ingredients',
  ベジタリアン:
    'Contains no meat, poultry, fish, or seafood, but may contain eggs or dairy',
  ビーガン: 'Contains no animal products or by-products whatsoever',
};

export function getDietaryDescription(option: string): string {
  return DIETARY_DESCRIPTIONS[option] || option;
}

export function DietaryBadge({ option }: { option: string }) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="badge-dietary-trigger"
          aria-label={`Dietary info: ${option}`}
        >
          <span>{option}</span>
          <Info className="w-2.5 h-2.5" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="z-50 bg-kasshoku-deep text-washi text-xs px-3 py-2 rounded-sm shadow-xl max-w-xs"
      >
        {getDietaryDescription(option)}
      </TooltipContent>
    </TooltipRoot>
  );
}
