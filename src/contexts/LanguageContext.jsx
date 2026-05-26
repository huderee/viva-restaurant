// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') === 'en' ? 'en' : 'mn'; }
    catch { return 'mn'; }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'mn' ? 'en' : 'mn';
      try { localStorage.setItem('lang', next); } catch {}
      return next;
    });
  }, []);

  /** t(key) — key-г орчуулна; олдохгүй бол key-г буцаана */
  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations['mn']?.[key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
