import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rbx-red/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 font-semibold',
    md: 'px-5 py-2.5 text-sm gap-2 font-semibold',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-bold tracking-wide',
  };

  const variantStyles = {
    primary: 'bg-rbx-red text-white hover:bg-rbx-red-hover shadow-glow-red hover:shadow-glow-red-lg border border-red-500/40',
    secondary: 'bg-rbx-dark-700/80 text-rbx-dark-100 hover:bg-rbx-dark-600 hover:text-white border border-white/10 backdrop-blur-sm',
    outline: 'bg-transparent text-white border-2 border-rbx-red/80 hover:bg-rbx-red/10 hover:border-rbx-red shadow-glow-subtle',
    whatsapp: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30',
    ghost: 'bg-transparent text-rbx-dark-300 hover:text-white hover:bg-white/5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
