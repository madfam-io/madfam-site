'use client';

import { cn } from './utils';

interface BrandParticlesProps {
  className?: string;
  count?: number;
  variant?: 'default' | 'subtle' | 'intense';
  density?: 'low' | 'medium' | 'high';
  colorScheme?: 'auto' | 'brand' | 'neutral';
  movement?: 'static' | 'dynamic' | 'wave';
  interactive?: boolean;
}

export function BrandParticles({
  className,
  count = 20,
  variant = 'default',
  density = 'medium',
  colorScheme: _colorScheme = 'auto',
  movement: _movement = 'static',
  interactive: _interactive = false,
}: BrandParticlesProps) {
  const densityCounts = {
    low: 10,
    medium: 20,
    high: 40,
  };
  const particleCount = count || densityCounts[density];
  const opacityLevels = {
    default: 'opacity-30',
    subtle: 'opacity-10',
    intense: 'opacity-50',
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500',
            opacityLevels[variant]
          )}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      ))}
    </div>
  );
}
