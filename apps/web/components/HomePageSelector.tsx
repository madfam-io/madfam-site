'use client';

import { useState, useEffect } from 'react';
import { CorporateHomePage } from './CorporateHomePage';
import { VisionFirstHomePage } from './VisionFirstHomePage';

type HomePageVariant = 'A' | 'B';

interface HomePageSelectorProps {
  /** Force a specific variant (useful for testing) */
  forcedVariant?: HomePageVariant;
  /** Enable A/B testing mode */
  abTest?: boolean;
}

/**
 * HomePageSelector - Allows switching between homepage variants
 *
 * Variant A: CorporateHomePage - Current detailed version with persona selector
 * Variant B: VisionFirstHomePage - Vision-first approach with mission emphasis
 *
 * Usage:
 * - Default: Shows based on localStorage preference or random A/B assignment
 * - forcedVariant: Force a specific variant
 * - abTest: Enable A/B testing with 50/50 split
 */
export function HomePageSelector({ forcedVariant, abTest = false }: HomePageSelectorProps) {
  const [variant, setVariant] = useState<HomePageVariant>('A');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If forced variant, use it
    if (forcedVariant) {
      setVariant(forcedVariant);
      setIsLoaded(true);
      return;
    }

    // Check localStorage for preference
    const storedVariant = localStorage.getItem('madfam_homepage_variant') as HomePageVariant | null;

    if (storedVariant && ['A', 'B'].includes(storedVariant)) {
      setVariant(storedVariant);
    } else if (abTest) {
      // A/B test: random assignment
      const randomVariant: HomePageVariant = Math.random() > 0.5 ? 'A' : 'B';
      localStorage.setItem('madfam_homepage_variant', randomVariant);
      setVariant(randomVariant);

      // Track A/B assignment
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('homepage_ab_assigned', {
          variant: randomVariant,
        });
      }
    }

    setIsLoaded(true);
  }, [forcedVariant, abTest]);

  // Prevent flash of wrong content
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return variant === 'B' ? <VisionFirstHomePage /> : <CorporateHomePage />;
}

/**
 * Hook to manually switch homepage variant
 */
export function useHomePageVariant() {
  const [variant, setVariantState] = useState<HomePageVariant>('A');

  useEffect(() => {
    const stored = localStorage.getItem('madfam_homepage_variant') as HomePageVariant | null;
    if (stored && ['A', 'B'].includes(stored)) {
      setVariantState(stored);
    }
  }, []);

  const setVariant = (newVariant: HomePageVariant) => {
    localStorage.setItem('madfam_homepage_variant', newVariant);
    setVariantState(newVariant);

    // Track variant change
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('homepage_variant_changed', {
        variant: newVariant,
      });
    }
  };

  return { variant, setVariant };
}
