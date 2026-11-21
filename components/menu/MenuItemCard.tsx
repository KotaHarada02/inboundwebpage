'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { MenuItem } from '@/domain/types';
import { Card } from '@/components/ui/Card';
import { Badge, DietaryBadge } from '@/components/ui/Badge';
import { PriceBadge, PriceBreakdownTable } from '@/components/menu/PriceDisplay';

export interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
  onSelectImage?: (imageUrl: string, alt: string) => void;
}

export function MenuItemCard({
  item,
  index = 0,
  onSelectImage,
}: MenuItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageBroken, setImageBroken] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex-none w-72 snap-center"
    >
      <Card.Root variant="soft" hoverLift className="group h-full flex flex-col">
        {/* Dish Image + Price Overlay */}
        <Card.Media className="h-52">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase font-light">
              No Image
            </span>
          </div>
          {!imageBroken && item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="menu-card-image"
              sizes="(max-width: 768px) 80vw, 320px"
              onClick={() => onSelectImage?.(item.imageUrl, item.name)}
              onError={() => setImageBroken(true)}
            />
          )}
          <div className="absolute bottom-0 right-0 m-3">
            <PriceBadge priceYen={item.priceYen} />
          </div>
        </Card.Media>

        <Card.Body className="p-5">
          {/* Title */}
          <Card.Title className="mb-1">{item.name}</Card.Title>

          {/* Multi-size price table */}
          <PriceBreakdownTable priceYen={item.priceYen} />

          {/* Expandable Description */}
          <div className="flex-1">
            <div
              className={`text-foreground-soft text-sm font-light leading-relaxed ${
                expanded ? '' : 'line-clamp-3'
              }`}
            >
              {item.description}
            </div>
            {item.description.length > 120 && (
              <button
                type="button"
                className="menu-card-more"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-3 h-3" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Ingredients, Dietary & Allergen Badges */}
          <Card.Footer className="space-y-2">
            {item.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.ingredients.slice(0, 4).map((ing, i) => (
                  <Badge key={`${ing}-${i}`} variant="ingredient">
                    {ing}
                  </Badge>
                ))}
                {item.ingredients.length > 4 && (
                  <span className="px-2 py-0.5 text-muted text-[10px] font-light">
                    +{item.ingredients.length - 4}
                  </span>
                )}
              </div>
            )}

            {(item.dietary.length > 0 || item.allergies.length > 0) && (
              <div className="flex flex-wrap gap-1">
                {item.dietary.map((opt, i) => (
                  <DietaryBadge key={`${opt}-${i}`} option={opt} />
                ))}
                {item.allergies.map((alg, i) => (
                  <Badge key={`${alg}-${i}`} variant="allergen">
                    {alg}
                  </Badge>
                ))}
              </div>
            )}
          </Card.Footer>
        </Card.Body>
      </Card.Root>
    </motion.div>
  );
}
