import { Container } from '@/components/ui';
import { CardSkeleton, Skeleton, SkeletonContainer } from '@/components/Skeleton';

export default function ProductsLoading() {
  return (
    <main className="py-section">
      <Container>
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <SkeletonContainer>
            <Skeleton width="50%" height={48} className="mx-auto mb-4" />
            <Skeleton width="70%" height={24} className="mx-auto mb-8" />
            <div className="flex gap-4 justify-center">
              <Skeleton variant="rounded" width={150} height={44} />
              <Skeleton variant="rounded" width={150} height={44} />
            </div>
          </SkeletonContainer>
        </div>

        {/* Product Cards Skeleton */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8"
            >
              <SkeletonContainer>
                <div className="flex items-start gap-4 mb-6">
                  <Skeleton variant="rounded" width={64} height={64} />
                  <div className="flex-1">
                    <Skeleton width="40%" height={32} className="mb-2" />
                    <Skeleton width="60%" height={20} />
                  </div>
                </div>
                <Skeleton width="100%" />
                <Skeleton width="90%" />
                <Skeleton width="95%" className="mb-6" />
                <div className="space-y-3 mb-8">
                  {[...Array(4)].map((__, featureIndex) => (
                    <div key={featureIndex} className="flex gap-3">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton width="80%" />
                    </div>
                  ))}
                </div>
                <Skeleton variant="rounded" width="100%" height={48} />
              </SkeletonContainer>
            </div>
          ))}
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, gridIndex) => (
            <CardSkeleton key={gridIndex} />
          ))}
        </div>
      </Container>
    </main>
  );
}
