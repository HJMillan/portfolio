import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  readonly label: string;
  readonly value: number | string;
  readonly icon: ReactNode;
  readonly description?: string;
  readonly className?: string;
  readonly accentColor?: 'teal' | 'purple' | 'green' | 'amber';
}

const accentMap = {
  teal: 'text-accent',
  purple: 'text-accent-alt',
  green: 'text-success',
  amber: 'text-warning',
} as const;

const glowMap = {
  teal: 'shadow-(--shadow-glow-accent)',
  purple: 'shadow-(--shadow-glow-alt)',
  green: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
} as const;

export function KPICard({
  label,
  value,
  icon,
  description,
  className,
  accentColor = 'teal',
}: KPICardProps) {
  const numericValue = typeof value === 'number' ? value : null;
  const displayValue = useCountUp(numericValue);

  return (
    <Card
      className={cn('group', glowMap[accentColor], className)}
      padding="md"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {label}
          </p>
          <p className={cn(
            'text-2xl font-bold font-mono tracking-tight',
            accentMap[accentColor]
          )}>
            {numericValue === null ? value : displayValue}
          </p>
          {description && (
            <p className="text-xs text-text-muted">{description}</p>
          )}
        </div>
        <div className={cn(
          'p-2 rounded-md bg-surface-hover transition-colors duration-200',
          'group-hover:bg-accent/10'
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function useCountUp(target: number | null): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === null) return;

    const duration = 600;
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target!));
      
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target]);

  return target === null ? 0 : current;
}
