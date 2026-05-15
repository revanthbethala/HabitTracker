import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-[var(--text-h)]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm ring-offset-[var(--bg)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-rose-500 focus-visible:ring-rose-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rose-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
