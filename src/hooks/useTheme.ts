import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

function getSystemTheme(): Theme {
  if (globalThis.window === undefined) return 'dark';
  return globalThis.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return getStoredTheme() ?? getSystemTheme();
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* quota exceeded */ }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mq = globalThis.matchMedia('(prefers-color-scheme: light)');
    function handler(e: MediaQueryListEvent) {
      // Only follow system if user hasn't manually set a preference
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    }
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle, isDark: theme === 'dark' } as const;
}
