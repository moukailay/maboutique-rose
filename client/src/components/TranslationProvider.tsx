import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationContext, translations } from '@/hooks/useTranslation';

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('fr');

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('rose-d-eden-language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rose-d-eden-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]];
    if (!translation) {
      console.warn(`Translation key "${key}" not found for language "${language}"`);
      return key;
    }
    return translation;
  };

  const contextValue = {
    language,
    setLanguage,
    t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}