'use client';

import type { MenuItem } from '@/domain/types';
import { Badge } from '@/components/ui/Badge';

const yenFormatter = new Intl.NumberFormat('ja-JP');

export function formatYenAmount(value: number): string {
  return `¥${yenFormatter.format(value)}`;
}

export function PriceBadge({ priceYen }: { priceYen: MenuItem['priceYen'] }) {
  if (typeof priceYen === 'number') {
    return <Badge variant="price">{formatYenAmount(priceYen)}</Badge>;
  }

  const values = Object.values(priceYen as Record<string, number>).filter(
    (v): v is number => typeof v === 'number' && !Number.isNaN(v)
  );
  if (values.length === 0) return null;

  const minPrice = Math.min(...values);
  return <Badge variant="price">{formatYenAmount(minPrice)}〜</Badge>;
}

export function PriceBreakdownTable({
  priceYen,
}: {
  priceYen: MenuItem['priceYen'];
}) {
  if (typeof priceYen !== 'object' || priceYen === null) return null;

  const entries = Object.entries(priceYen as Record<string, number>).filter(
    ([, price]) => typeof price === 'number' && !Number.isNaN(price)
  );
  if (entries.length === 0) return null;

  return (
    <div className="mb-3 border-t border-kasshoku/10 pt-2 mt-1">
      {entries.map(([size, price]) => (
        <div key={size} className="flex justify-between items-baseline py-0.5">
          <span className="text-xs text-muted font-light truncate mr-2 max-w-[60%]">
            {size}
          </span>
          <span className="text-xs text-foreground font-light tabular-nums whitespace-nowrap">
            {formatYenAmount(price)}
          </span>
        </div>
      ))}
    </div>
  );
}
