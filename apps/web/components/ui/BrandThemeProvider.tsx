'use client';

import { createContext, useContext, ReactNode, useState } from 'react';

type BrandMode = 'solarpunk-legacy' | 'corporate' | 'minimal' | string;
type ColorMode = 'light' | 'dark' | 'system';

interface BrandTheme {
  brandMode: BrandMode;
  colorMode: ColorMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  setBrandMode: (mode: BrandMode) => void;
  setColorMode: (mode: ColorMode) => void;
}

const defaultTheme: BrandTheme = {
  brandMode: 'solarpunk-legacy',
  colorMode: 'light',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
  },
  setBrandMode: () => {},
  setColorMode: () => {},
};

const BrandThemeContext = createContext<BrandTheme>(defaultTheme);

interface BrandThemeProviderProps {
  children: ReactNode;
  defaultBrandMode?: BrandMode;
  defaultColorMode?: ColorMode;
  theme?: Partial<BrandTheme>;
}

export function BrandThemeProvider({
  children,
  defaultBrandMode = 'solarpunk-legacy',
  defaultColorMode = 'light',
  theme,
}: BrandThemeProviderProps) {
  const [brandMode, setBrandMode] = useState<BrandMode>(defaultBrandMode);
  const [colorMode, setColorMode] = useState<ColorMode>(defaultColorMode);

  const mergedTheme: BrandTheme = {
    ...defaultTheme,
    ...theme,
    brandMode,
    colorMode,
    colors: {
      ...defaultTheme.colors,
      ...theme?.colors,
    },
    setBrandMode,
    setColorMode,
  };

  return <BrandThemeContext.Provider value={mergedTheme}>{children}</BrandThemeContext.Provider>;
}

export function useBrandTheme() {
  return useContext(BrandThemeContext);
}
