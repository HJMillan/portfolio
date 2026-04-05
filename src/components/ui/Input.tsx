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
          'input-base',
          className
        )}
        {...props}
      />
    </div>
  );
}
