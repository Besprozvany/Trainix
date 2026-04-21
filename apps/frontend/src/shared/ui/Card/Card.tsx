import { motion } from 'framer-motion';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, className = '', children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, boxShadow: '0 20px 40px rgba(99,102,241,0.1)' } : undefined}
      transition={{ duration: 0.2 }}
      className={`
        rounded-2xl border border-[#2e2e3e] bg-[#18181f] p-6
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...(props as Parameters<typeof motion.div>[0])}
    >
      {children}
    </motion.div>
  );
}
