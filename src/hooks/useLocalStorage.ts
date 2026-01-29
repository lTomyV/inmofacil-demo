/**
 * useLocalStorage Hook
 * Custom hook for managing localStorage with TypeScript type safety
 */

import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'inmo_v2_data_';

export function useLocalStorage<T>(key: string, fallback: T): [T, (value: T) => void] {
  const storageKey = STORAGE_PREFIX + key;

  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [value, storageKey]);

  return [value, setValue];
}
