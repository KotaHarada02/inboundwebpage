'use client';

import React from 'react';
import Link from 'next/link';

export type ButtonVariant =
  | 'primary'
  | 'outline-light'
  | 'outline-dark'
  | 'ghost'
  | 'time-active'
  | 'time-inactive';

export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'group relative bg-shibu-aka hover:bg-shibu-aka-deep text-washi rounded-sm font-light glow-shibu-aka hover:-translate-y-0.5 overflow-hidden transition-all duration-300',
  'outline-light':
    'bg-transparent hover:bg-washi/10 text-washi border border-washi/35 hover:border-washi/65 rounded-sm font-light backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-300',
  'outline-dark':
    'bg-transparent hover:bg-background-soft text-foreground border border-kasshoku/25 hover:border-shibu-aka hover:text-shibu-aka rounded-sm font-light transition-all duration-300',
  ghost:
    'bg-transparent text-foreground-soft hover:text-shibu-aka hover:bg-background-soft/60 rounded-sm font-light transition-colors duration-200',
  'time-active':
    'bg-shibu-aka text-washi rounded-sm font-light shadow-[0_4px_12px_-4px_rgba(178,58,43,0.6)] transition-all duration-300',
  'time-inactive':
    'text-kohaku-soft/75 hover:text-kohaku-soft border border-washi/10 hover:border-washi/30 rounded-sm font-light transition-all duration-300',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs tracking-[0.15em] uppercase',
  md: 'px-6 py-3 text-xs sm:text-sm tracking-[0.18em] uppercase',
  lg: 'px-10 py-4 text-sm tracking-[0.2em] uppercase min-w-[200px]',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withShine?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  withShine = variant === 'primary',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center text-center select-none disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {withShine && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-shibu-aka-deep/0 via-washi/15 to-shibu-aka-deep/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none"
        />
      )}
    </button>
  );
}

export interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  withShine?: boolean;
  external?: boolean;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  withShine = variant === 'primary',
  external = false,
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Link
      {...externalProps}
      className={`inline-flex items-center justify-center text-center select-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {withShine && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-shibu-aka-deep/0 via-washi/15 to-shibu-aka-deep/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none"
        />
      )}
    </Link>
  );
}
