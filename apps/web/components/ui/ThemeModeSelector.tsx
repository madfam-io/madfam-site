'use client';

import { cn } from './utils';
import { useBrandTheme } from './BrandThemeProvider';

interface ThemeModeSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeModeSelector({ className, showLabel = false }: ThemeModeSelectorProps) {
  const { colorMode, setColorMode, brandMode, setBrandMode } = useBrandTheme();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && <span className="text-sm text-gray-500">Theme:</span>}
      <button
        onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {colorMode === 'light' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
      <button
        onClick={() => setBrandMode(brandMode === 'corporate' ? 'solarpunk' : 'corporate')}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-medium"
        aria-label={`Switch to ${brandMode === 'corporate' ? 'solarpunk' : 'corporate'} brand`}
      >
        {brandMode === 'corporate' ? '🌿' : '🏢'}
      </button>
    </div>
  );
}
