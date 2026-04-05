import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: 'sm' | 'md';
  variant?: 'filled' | 'outline';
}

export function Badge({
  children,
  className,
  color,
  size = 'sm',
  variant = 'filled',
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium font-mono whitespace-nowrap',
        size === 'sm' && 'px-2 py-0.5 text-2xs tracking-wide',
        size === 'md' && 'px-3 py-1 text-xs',
        variant === 'filled' && 'bg-surface-hover text-text-secondary',
        variant === 'outline' && 'border border-border text-text-secondary',
        className
      )}
      style={
        color
          ? {
              backgroundColor:
                variant === 'filled' ? `${color}18` : 'transparent',
              color: color,
              borderColor: variant === 'outline' ? `${color}40` : undefined,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
