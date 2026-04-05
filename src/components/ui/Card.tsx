import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'accent' | 'accent-alt';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  className,
  variant = 'default',
  hover = true,
  padding = 'md',
  animate = true,
}: Readonly<CardProps>) {
  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-300',
        paddingMap[padding],
        variant === 'default' && 'bg-surface border-border-subtle',
        variant === 'glass' &&
          'bg-surface/60 backdrop-blur-md border-border-subtle/50',
        variant === 'accent' && 'bg-surface border-accent/30',
        variant === 'accent-alt' && 'bg-surface border-accent-alt/30',
        hover &&
          'hover:border-accent/50 hover:shadow-(--shadow-card-hover) hover:-translate-y-px',
        animate && 'animate-fade-in opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
