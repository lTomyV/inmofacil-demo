/**
 * useDarkMode Hook
 * Manages dark mode state with system preference detection
 */

import { useState, useEffect } from 'react';
import { AppearanceMode } from '../types';

export function useDarkMode(appearance: AppearanceMode) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateAppearance = () => {
      if (appearance === 'dark') {
        setIsDark(true);
      } else if (appearance === 'light') {
        setIsDark(false);
      } else {
        // system
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    };

    updateAppearance();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (appearance === 'system') {
        setIsDark(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [appearance]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return isDark;
}
