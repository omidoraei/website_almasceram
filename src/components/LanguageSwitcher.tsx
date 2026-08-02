import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const LANGUAGES: { code: Language; name: string; flag: string; label: string }[] = [
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', label: 'FA' },
  { code: 'en', name: 'English', flag: '🇬🇧', label: 'EN' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', label: 'AR' }
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange }) => {
  const context = useLanguage();
  const activeLang = currentLang || context.language;
  const changeLang = onLanguageChange || context.setLanguage;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = LANGUAGES.find((l) => l.code === activeLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 text-xs font-mono font-bold transition-all shadow-sm"
        title="تغییر زبان / Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span>{currentLangObj.flag} {currentLangObj.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-slate-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 p-1 space-y-1 text-xs backdrop-blur-xl">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLang(lang.code);
                setOpen(false);
              }}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-right transition-all font-medium ${
                activeLang === lang.code
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {activeLang === lang.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
