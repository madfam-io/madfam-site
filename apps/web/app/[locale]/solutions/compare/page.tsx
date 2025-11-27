import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductComparisonMatrix } from '@/components/ProductComparisonMatrix';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'compare' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
    },
  };
}

export default async function ComparePage() {
  return <ProductComparisonMatrix />;
}
