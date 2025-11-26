import { cn } from '@/components/ui';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
  };

  return (
    <div
      className={cn(baseClasses, animationClasses[animation], variantClasses[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
}

// Skeleton container for grouping multiple skeletons
export function SkeletonContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true" aria-live="polite">
      {children}
    </div>
  );
}

// Pre-built skeleton patterns
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
      <SkeletonContainer>
        <Skeleton variant="rounded" height={200} className="mb-4" />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
        <Skeleton width="40%" />
      </SkeletonContainer>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
      <SkeletonContainer>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton width="50%" height={24} className="mb-2" />
            <Skeleton width="30%" height={16} />
          </div>
        </div>
        <Skeleton width="100%" />
        <Skeleton width="90%" />
        <Skeleton width="95%" />
        <div className="mt-6 space-y-2">
          <Skeleton width="70%" />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </div>
        <Skeleton variant="rounded" height={44} className="mt-6" />
      </SkeletonContainer>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
      <SkeletonContainer>
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="circular" width={16} height={16} />
          ))}
        </div>
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="80%" />
        <div className="flex items-center gap-3 mt-6">
          <Skeleton variant="circular" width={40} height={40} />
          <div>
            <Skeleton width={120} height={16} className="mb-1" />
            <Skeleton width={80} height={14} />
          </div>
        </div>
      </SkeletonContainer>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Skeleton width="80%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton width="60%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton width="40%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton variant="rounded" width={80} height={32} />
      </td>
    </tr>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton width={100} height={16} />
      <Skeleton variant="rounded" height={40} />
    </div>
  );
}
