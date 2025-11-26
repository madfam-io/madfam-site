'use client';

import { cn } from './utils';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'color';
  colorMode?: 'default' | 'white' | 'color';
  className?: string;
  animate?: boolean;
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function AnimatedLogo({
  size = 'md',
  variant = 'default',
  colorMode,
  className,
  animate = true,
}: AnimatedLogoProps) {
  const effectiveVariant = colorMode || variant;
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        sizeStyles[size],
        animate && 'animate-pulse',
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          'w-full h-full',
          effectiveVariant === 'white' && 'text-white',
          effectiveVariant === 'color' && 'text-blue-600',
          effectiveVariant === 'default' && 'text-current'
        )}
        fill="currentColor"
      >
        <circle cx="50" cy="50" r="45" className="opacity-20" />
        <circle cx="50" cy="50" r="35" className="opacity-40" />
        <circle cx="50" cy="50" r="25" className="opacity-60" />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          className="fill-current"
        >
          M
        </text>
      </svg>
    </div>
  );
}
