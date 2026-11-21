'use client';

import React from 'react';

export type CardVariant = 'elevated' | 'soft' | 'dark';

const CARD_VARIANTS: Record<CardVariant, string> = {
  elevated:
    'bg-background border border-kasshoku/10 rounded-md overflow-hidden relative',
  soft: 'card-soft',
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
          ? 'card-hover-lift'
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
      className={`card-title ${className}`}
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
