import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20',
  ghost: 'border border-[#2e2e3e] hover:border-indigo-500/50 hover:bg-[#18181f] text-[#e8e8f0]',
  danger: 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-[10px] font-medium
        transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || isLoading}
      {...(props as Parameters<typeof motion.button>[0])}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
}
