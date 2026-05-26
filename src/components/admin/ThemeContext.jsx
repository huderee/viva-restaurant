// src/components/admin/ThemeContext.jsx
// Dark/Light theme удирдлага — localStorage + data-theme attribute.

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext({ theme: 'dark', toggle: () => {}, setTheme: () => {} });
const STORAGE_KEY = 'admin_theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  const setTheme = (t) => setThemeState(t === 'light' ? 'light' : 'dark');
  const toggle = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
