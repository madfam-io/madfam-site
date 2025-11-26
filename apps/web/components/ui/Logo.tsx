import { cn } from './utils';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'default' | 'minimal' | 'full' | 'icon' | 'wordmark';
type ColorMode = 'light' | 'dark' | 'auto' | 'color' | 'white' | 'mono';

interface LogoProps {
  className?: string;
  size?: LogoSize;
  variant?: LogoVariant;
  colorMode?: ColorMode;
  animated?: boolean;
}

const sizeStyles: Record<LogoSize, string> = {
  xs: 'h-4 text-sm',
  sm: 'h-6 text-base',
  md: 'h-8 text-xl',
  lg: 'h-12 text-2xl',
  xl: 'h-16 text-3xl',
};

export function LogoSystem({
  className,
  size = 'md',
  variant: _variant,
  colorMode: _colorMode,
  animated,
}: LogoProps) {
  return (
    <div
      className={cn(
        'font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
        sizeStyles[size],
        animated && 'animate-pulse',
        className
      )}
    >
      MADFAM
    </div>
  );
}

export function LoadingLogo({ className, size = 'md' }: LogoProps) {
  return (
    <div className={cn('animate-pulse', sizeStyles[size], className)}>
      <div className="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-50" />
    </div>
  );
}

interface LogoWithTaglineProps extends LogoProps {
  tagline?: string;
}

export function LogoWithTagline({
  className,
  size = 'md',
  tagline = 'Innovation Studio',
  variant,
  colorMode,
  animated,
}: LogoWithTaglineProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <LogoSystem size={size} variant={variant} colorMode={colorMode} animated={animated} />
      <span className="text-xs text-gray-500 mt-1">{tagline}</span>
    </div>
  );
}
