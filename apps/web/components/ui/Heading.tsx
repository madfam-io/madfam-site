import { cn } from './utils';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: boolean;
}

const levelStyles = {
  1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  2: 'text-3xl md:text-4xl font-bold tracking-tight',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium',
};

export function Heading({ children, level = 2, className, as, gradient }: HeadingProps) {
  const Component = as || (`h${level}` as const);

  return (
    <Component
      className={cn(
        levelStyles[level],
        gradient && 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Component>
  );
}
