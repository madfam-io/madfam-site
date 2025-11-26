import { Container } from '@/components/ui';
import { FormFieldSkeleton, Skeleton, SkeletonContainer } from '@/components/Skeleton';

export default function ContactLoading() {
  return (
    <main className="py-section">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <SkeletonContainer>
              <Skeleton width="40%" height={48} className="mx-auto mb-4" />
              <Skeleton width="60%" height={24} className="mx-auto" />
            </SkeletonContainer>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info Skeleton */}
            <div>
              <SkeletonContainer>
                <Skeleton width="50%" height={28} className="mb-6" />
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton variant="circular" width={48} height={48} />
                      <div className="flex-1">
                        <Skeleton width="30%" height={20} className="mb-2" />
                        <Skeleton width="60%" height={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonContainer>
            </div>

            {/* Form Skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              <SkeletonContainer>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormFieldSkeleton />
                  <FormFieldSkeleton />
                </div>
                <FormFieldSkeleton />
                <FormFieldSkeleton />
                <div className="space-y-2">
                  <Skeleton width={100} height={16} />
                  <Skeleton variant="rounded" height={120} />
                </div>
                <Skeleton variant="rounded" width="100%" height={44} className="mt-6" />
              </SkeletonContainer>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
