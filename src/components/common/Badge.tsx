import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'dark' | 'emerald' | 'amber' | 'blue';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'red',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    red: 'bg-rbx-red/15 text-rbx-red border-rbx-red/40 border',
    dark: 'bg-rbx-dark-700/90 text-rbx-dark-200 border-white/10 border',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 border',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/40 border',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/40 border',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-md tracking-wider uppercase backdrop-blur-sm ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
