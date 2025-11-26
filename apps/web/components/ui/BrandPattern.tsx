import { cn } from './utils';

interface BrandPatternProps {
  className?: string;
  variant?: 'dots' | 'grid' | 'waves';
}

export function StaticBrandPattern({ className, variant = 'dots' }: BrandPatternProps) {
  const patterns = {
    dots: (
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
      </pattern>
    ),
    grid: (
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
        />
      </pattern>
    ),
    waves: (
      <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M0 10 Q 25 0, 50 10 T 100 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
        />
      </pattern>
    ),
  };

  return (
    <svg className={cn('absolute inset-0 w-full h-full', className)} preserveAspectRatio="none">
      <defs>{patterns[variant]}</defs>
      <rect width="100%" height="100%" fill={`url(#${variant})`} />
    </svg>
  );
}
