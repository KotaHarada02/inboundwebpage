'use client';

import React from 'react';

export type CardVariant = 'elevated' | 'soft' | 'dark';

const CARD_VARIANTS: Record<CardVariant, string> = {
  elevated:
    'bg-background border border-kasshoku/10 rounded-md overflow-hidden relative',
  soft:
    'bg-background-soft/60 backdrop-blur-sm border border-kasshoku/10 rounded-md overflow-hidden relative',
  dark:
    'bg-kasshoku-deep text-washi rounded-md overflow-hidden relative',
};

export interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverLift?: boolean;
}

function CardRoot({
  variant = 'soft',
  hoverLift = false,
  className = '',
  style,
  children,
  ...props
}: CardRootProps) {
  return (
    <div
      className={`${CARD_VARIANTS[variant]} ${
        hoverLift
          ? 'transition-all duration-400 hover:-translate-y-1 shadow-[0_4px_24px_-8px_rgba(91,58,41,0.12)] hover:shadow-[0_12px_40px_-12px_rgba(91,58,41,0.22)]'
          : 'shadow-[0_30px_60px_-20px_rgba(31,26,20,0.35)]'
      } ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

function CardAccentBar({
  direction = 'ltr',
  className = '',
}: {
  direction?: 'ltr' | 'rtl';
  className?: string;
}) {
  const gradient =
    direction === 'ltr'
      ? 'bg-gradient-to-r from-kohaku via-shibu-aka to-kasshoku'
      : 'bg-gradient-to-r from-kasshoku via-shibu-aka to-kohaku';
  return <div className={`h-1 w-full ${gradient} ${className}`} aria-hidden="true" />;
}

function CardMedia({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative overflow-hidden bg-background-soft flex-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 flex flex-col flex-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({
  as: Tag = 'h3',
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h2' | 'h3' | 'h4';
}) {
  return (
    <Tag
      className={`font-serif text-lg sm:text-xl font-light text-foreground tracking-wide leading-snug ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

function CardFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mt-4 pt-3 border-t border-kasshoku/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export const Card = {
  Root: CardRoot,
  AccentBar: CardAccentBar,
  Media: CardMedia,
  Body: CardBody,
  Title: CardTitle,
  Footer: CardFooter,
};
