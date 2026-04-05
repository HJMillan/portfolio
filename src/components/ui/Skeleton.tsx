import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-hover',
        variant === 'text' && 'rounded h-4 w-full',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-md',
        className
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-5 space-y-4">
      <Skeleton height="16px" width="60%" />
      <Skeleton height="12px" width="100%" />
      <Skeleton height="12px" width="80%" />
      <div className="flex gap-2 pt-2">
        <Skeleton height="20px" width="60px" className="rounded-full" />
        <Skeleton height="20px" width="80px" className="rounded-full" />
      </div>
    </div>
  );
}
