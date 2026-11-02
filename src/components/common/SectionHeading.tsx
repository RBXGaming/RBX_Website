import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlightText?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlightText,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-12 md:mb-16 ${alignStyles[align]} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rbx-red/10 text-rbx-red border border-rbx-red/30 mb-4 shadow-glow-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-rbx-red animate-ping" />
          {badge}
        </div>
      )}
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display uppercase leading-tight">
        {title}{' '}
        {highlightText && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
            {highlightText}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-rbx-dark-300 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
