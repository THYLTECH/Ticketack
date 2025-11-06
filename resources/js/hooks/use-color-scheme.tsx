import { useCallback, useEffect, useState } from 'react';

// export type ColorScheme =
//   | 'default'
//   | 'blue'
//   | 'red'
//   | 'green'
//   | 'orange'
//   | 'rose'
//   | 'violet'
//   | 'yellow';

export type ColorScheme = string;

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyColorScheme = (scheme: ColorScheme) => {
  document.documentElement.setAttribute('data-color-scheme', scheme);
};

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>('default');

  const updateColorScheme = useCallback((newScheme: ColorScheme) => {
    setScheme(newScheme);
    localStorage.setItem('color-scheme', newScheme);
    setCookie('color-scheme', newScheme);
    applyColorScheme(newScheme);
  }, []);

  useEffect(() => {
    const saved =
      (localStorage.getItem('color-scheme') as ColorScheme) || 'default';
    applyColorScheme(saved);
    setScheme(saved);
  }, []);

  return { scheme, updateColorScheme } as const;
}

export function initializeColorScheme() {
  const saved =
    (localStorage.getItem('color-scheme') as ColorScheme) || 'default';
  document.documentElement.setAttribute('data-color-scheme', saved);
}
