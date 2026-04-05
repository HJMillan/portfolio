import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-text-muted mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-200',
          className
        )}
        {...props}
      />
    </div>
  );
}
