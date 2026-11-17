'use client';

import Image from 'next/image';
import { Expand } from 'lucide-react';
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
  aspectClassName = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
  onSelectImage,
}: DishMediaFrameProps) {
  const imageExists = hasMenuImage(src);
  const vessel = resolveVesselKind(category);

  if (imageExists && src) {
    return (
      <div
        className={`relative w-full ${aspectClassName} overflow-hidden bg-surface-muted border-b border-[color:var(--color-border)] group`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {onSelectImage && (
          <button
            type="button"
            onClick={() => onSelectImage(src, alt)}
            aria-label={`Enlarge photo of ${alt}`}
            className="absolute inset-0 w-full h-full flex items-end justify-end p-2.5 bg-kasshoku-deep/0 hover:bg-kasshoku-deep/15 transition-colors duration-200 cursor-zoom-in"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-kasshoku-deep/85 text-washi text-xs rounded-xs opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
              <Expand className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Enlarge</span>
            </span>
          </button>
        )}
        {priceBadge && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className="inline-block bg-kasshoku-deep/90 text-washi font-tabular text-xs font-medium px-2.5 py-1 rounded-xs border border-washi/15">
              {priceBadge}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClassName} bg-surface-muted border-b border-[color:var(--color-border)] flex flex-col items-center justify-center p-5 text-center select-none`}
    >
      <VesselIllustration kind={vessel} />
      <p className="mt-2.5 font-serif text-xs text-foreground-soft line-clamp-1 max-w-[90%]">
        {itemName || alt}
      </p>
      <p className="mt-0.5 text-[11px] text-muted">
        Photo in preparation · 実写準備中
      </p>
      {priceBadge && (
        <div className="absolute bottom-2.5 left-2.5">
          <span className="inline-block bg-surface-elevated text-foreground font-tabular text-xs font-medium px-2.5 py-1 rounded-xs border border-[color:var(--color-border-strong)]">
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
          className="w-16 h-11 text-foreground-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Steam lines */}
          <path d="M36 16c0-4 3-5 3-9M48 14c0-4 3-5 3-9M60 16c0-4 3-5 3-9" strokeOpacity="0.45" />
          {/* Chopsticks */}
          <path d="M22 22h54M26 18l48 3" stroke="#A32C1E" />
          {/* Lacquer bowl */}
          <path d="M16 28h64c-2 18-14 26-32 26S18 46 16 28Z" />
          <path d="M34 54h28v4H34z" />
        </svg>
      );
    case 'sake':
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-16 h-11 text-foreground-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Tokkuri flask */}
          <path d="M34 14h10l-2 8c6 5 9 12 9 21 0 6-3 11-12 11s-12-5-12-11c0-9 3-16 9-21l-2-8Z" />
          {/* Ochoko cup */}
          <path d="M58 38h18l-2 14c-1 2-3 3-7 3s-6-1-7-3l-2-14Z" stroke="#A32C1E" />
        </svg>
      );
    case 'beer':
    case 'wine':
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-16 h-11 text-foreground-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Craft pint / tasting glass */}
          <path d="M34 12h28l-3 42H37L34 12Z" />
          <path d="M35 20h26" stroke="#B86B19" />
          <circle cx="44" cy="30" r="1" fill="currentColor" />
          <circle cx="51" cy="36" r="1" fill="currentColor" />
          <circle cx="47" cy="43" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 96 64"
          className="w-16 h-11 text-foreground-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Wooden tray & small fermented plates */}
          <rect x="14" y="44" width="68" height="6" rx="1" />
          <path d="M22 32h22c-1 8-5 12-11 12s-10-4-11-12Z" />
          <path d="M52 32h22c-1 8-5 12-11 12s-10-4-11-12Z" stroke="#A32C1E" />
        </svg>
      );
  }
}
