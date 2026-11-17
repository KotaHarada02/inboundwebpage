'use client';

import Image from 'next/image';
import { hasMenuImage } from '@/lib/menuUtils';

export type VesselKind = 'ramen' | 'sake' | 'beer' | 'wine' | 'ippin' | 'drink' | 'dessert';

export function resolveVesselKind(category: string): VesselKind {
  const normalized = category.toLowerCase();
  if (normalized.includes('ramen') || normalized.includes('kaedama')) return 'ramen';
  if (normalized.includes('sake')) return 'sake';
  if (normalized.includes('beer')) return 'beer';
  if (normalized.includes('wine')) return 'wine';
  if (normalized.includes('dessert')) return 'dessert';
  if (normalized.includes('softdrink') || normalized.includes('drink')) return 'drink';
  return 'ippin';
}

interface DishMediaFrameProps {
  src?: string | null;
  alt: string;
  category: string;
  itemName?: string;
  priceBadge?: string;
  aspectClassName?: string;
  sizes?: string;
  onSelectImage?: (src: string, alt: string) => void;
}

export function DishMediaFrame({
  src,
  alt,
  category,
  itemName,
  priceBadge,
  aspectClassName = 'aspect-square',
  sizes = '(max-width: 640px) 45vw, 220px',
  onSelectImage,
}: DishMediaFrameProps) {
  const imageExists = hasMenuImage(src);
  const vessel = resolveVesselKind(category);

  if (imageExists && src) {
    return (
      <div
        onClick={onSelectImage ? () => onSelectImage(src, alt) : undefined}
        className={`relative w-full ${aspectClassName} overflow-hidden bg-surface-muted ${
          onSelectImage ? 'cursor-pointer' : ''
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {priceBadge && (
          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="inline-block bg-kasshoku-deep/85 text-washi font-tabular text-[11px] px-2 py-0.5">
              {priceBadge}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClassName} bg-surface-muted flex flex-col items-center justify-center p-3 text-center select-none`}
    >
      <VesselIllustration kind={vessel} />
      {itemName && (
        <span className="mt-2 font-serif text-[11px] text-foreground-soft line-clamp-2 px-1 leading-tight">
          {itemName}
        </span>
      )}
      {priceBadge && (
        <div className="absolute bottom-2 left-2">
          <span className="inline-block bg-surface text-foreground font-tabular text-[11px] px-2 py-0.5">
            {priceBadge}
          </span>
        </div>
      )}
    </div>
  );
}

function VesselIllustration({ kind }: { kind: VesselKind }) {
  switch (kind) {
    case 'ramen':
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-12 h-8 text-foreground-soft/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 22h54M26 18l48 3" stroke="#C83E2B" />
          <path d="M16 28h64c-2 18-14 26-32 26S18 46 16 28Z" />
          <path d="M34 54h28v4H34z" />
        </svg>
      );
    case 'sake':
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-12 h-8 text-foreground-soft/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M34 14h10l-2 8c6 5 9 12 9 21 0 6-3 11-12 11s-12-5-12-11c0-9 3-16 9-21l-2-8Z" />
          <path d="M58 38h18l-2 14c-1 2-3 3-7 3s-6-1-7-3l-2-14Z" stroke="#C83E2B" />
        </svg>
      );
    case 'beer':
    case 'wine':
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-12 h-8 text-foreground-soft/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M34 12h28l-3 42H37L34 12Z" />
          <path d="M35 20h26" stroke="#D9822B" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-12 h-8 text-foreground-soft/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="14" y="44" width="68" height="5" rx="1" />
          <path d="M22 32h22c-1 8-5 12-11 12s-10-4-11-12Z" />
          <path d="M52 32h22c-1 8-5 12-11 12s-10-4-11-12Z" stroke="#C83E2B" />
        </svg>
      );
  }
}
