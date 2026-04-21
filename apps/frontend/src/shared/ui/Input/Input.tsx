import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#8b8ba0]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-[10px] border border-[#2e2e3e] bg-[#18181f] px-4 py-3
            text-[#e8e8f0] placeholder-[#8b8ba0] text-sm
            outline-none transition-all duration-200
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
