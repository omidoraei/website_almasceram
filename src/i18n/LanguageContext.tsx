import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: TranslationKeys;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('almas_ceram_lang');
    return (saved as Language) || 'fa';
  });

  const dir: 'rtl' | 'ltr' = language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('almas_ceram_lang', lang);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);

    // Apply active font class
    if (language === 'en') {
      document.body.classList.remove('font-sans', 'dir-rtl');
      document.body.classList.add('font-mono', 'dir-ltr');
    } else {
      document.body.classList.remove('font-mono', 'dir-ltr');
      document.body.classList.add('font-sans', 'dir-rtl');
    }
  }, [language, dir]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.fa;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
