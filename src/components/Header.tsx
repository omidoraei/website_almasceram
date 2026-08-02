import React, { useState, useEffect, useRef } from 'react';
import { Search, Layers, Code, ShieldCheck, Menu, X, FileText, Lock, MessageSquare, Sparkles, ChevronDown, Grid, Award } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { LanguageSwitcher } from './LanguageSwitcher';

export type PageView = 'catalog' | 'products-catalog' | 'standards' | 'about' | 'portfolio' | 'faq' | 'contact' | 'privacy' | 'terms' | 'admin';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  inquiryCount: number;
  openInquiryModal: () => void;
  openArchModal: () => void;
  openVisualizerModal: () => void;
  openAdminModal: () => void;
  openContactModal: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activePage: PageView;
  onNavigate: (page: PageView) => void;
}

export const SIZES = ['30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'];

const MEGA_MENU_SIZES = [
  {
    size: '100x100',
    nameFa: 'اسلب مگا سایز ۱۰۰x۱۰۰',
    desc: 'پرسلان بزرگ اسلب بدون بند جهت سالن‌های لوکس',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80'
  },
  {
    size: '60x120',
    nameFa: 'پرسلان اسلب ۶۰x۱۲۰',
    desc: 'سوپر پولیش مرمر اونیکس رویال و کلکته گلد',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
  },
  {
    size: '80x80',
    nameFa: 'سرامیک پرسلان ۸۰x۸۰',
    desc: 'طرح پیترا گری مات مخملی و تراورتن کرم',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
  },
  {
    size: '60x60',
    nameFa: 'سرامیک مربع ۶۰x۶۰',
    desc: 'بافت بتن آرشیتکچر و ترازو مدرن',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
  },
  {
    size: '30x90',
    nameFa: 'کاشی دیواری ۳۰x۹۰',
    desc: 'بدنه سفید دکور دکوراتیو رستیک',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80'
  },
  {
    size: '40x40',
    nameFa: 'سرامیک کف ۴۰x۴۰',
    desc: 'کف بالکن و شیب‌بندی حمام و تراس',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
  },
  {
    size: '30x30',
    nameFa: 'پرسلان ۳۰x۳۰ R11',
    desc: 'ضد لغزش ویژه محیط‌های مرطوب و استخر',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
  }
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSize,
  setSelectedSize,
  inquiryCount,
  openInquiryModal,
  openArchModal,
  openVisualizerModal,
  openAdminModal,
  openContactModal,
  currentLang,
  onLanguageChange,
  activePage,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fa;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 text-slate-100 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-2xl border-b border-amber-500/30 shadow-2xl shadow-slate-950/90'
          : 'bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20'
      }`}
    >
      {/* Top Banner Bar - Clean Accent Bar without header statement text */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/30 to-slate-950 border-b border-amber-500/15 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <button 
              onClick={openContactModal}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors text-amber-300/90 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.contactUs}</span>
            </button>
            <span className="text-slate-700">|</span>
            <button 
              onClick={openAdminModal}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.adminPanel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => onNavigate('catalog')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-200/40 group-hover:scale-105 transition-all duration-300">
            <span className="font-black text-slate-950 text-2xl tracking-tighter">AC</span>
          </div>
          <div className="text-right">
            <span className="font-black text-xl tracking-wider bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent block">
              ALMAS CERAM
            </span>
            <span className="block text-[9px] text-amber-400/90 tracking-widest font-mono uppercase">
              ARCHITECTURAL PORCELAIN TILES
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-200" aria-label="Main Navigation">
          <button
            onClick={() => onNavigate('catalog')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activePage === 'catalog'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            صفحه اصلی
          </button>

          <button
            onClick={() => onNavigate('products-catalog')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activePage === 'products-catalog'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            گالری کاتالوگ
          </button>

          {/* Mega-Menu Dropdown Trigger for Tile Sizes */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-bold ${
                megaMenuOpen || selectedSize ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <Grid className="w-4 h-4 text-amber-400" />
              <span>{selectedSize ? `سایز: ${selectedSize}` : 'ابعاد و اسلب‌ها'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Interactive Mega Menu Box */}
            {megaMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-[720px] bg-slate-950/98 border border-amber-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl grid grid-cols-3 gap-3 text-right z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="col-span-3 border-b border-slate-800 pb-2 mb-1 flex items-center justify-between">
                  <span className="text-amber-300 font-black text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    انتخاب مستقیم بر اساس ابعاد اصلی کارخانه
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSize('');
                      setMegaMenuOpen(false);
                      onNavigate('products-catalog');
                    }}
                    className="text-[11px] text-amber-400 hover:underline font-bold"
                  >
                    نمایش تمامی سایزها
                  </button>
                </div>

                {MEGA_MENU_SIZES.map((item) => (
                  <div
                    key={item.size}
                    onClick={() => {
                      setSelectedSize(item.size);
                      setMegaMenuOpen(false);
                      onNavigate('products-catalog');
                    }}
                    className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 p-2.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 hover:bg-slate-900 shadow-md"
                  >
                    <img src={item.image} alt={item.nameFa} className="w-12 h-12 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-white text-xs group-hover:text-amber-300 flex items-center justify-between">
                        <span className="truncate">{item.nameFa}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold mr-1">{item.size}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('standards')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activePage === 'standards'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            استانداردها و گواهینامه‌ها
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activePage === 'about'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            درباره ما
          </button>

          <button
            onClick={() => onNavigate('portfolio')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activePage === 'portfolio'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            نمونه‌کارها
          </button>

          <button
            onClick={() => onNavigate('faq')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activePage === 'faq'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            سوالات متداول
          </button>
        </nav>

        {/* Global Search Bar */}
        <div className="hidden xl:flex flex-1 max-w-xs relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activePage !== 'products-catalog') onNavigate('products-catalog');
            }}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-full py-2 pr-10 pl-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openVisualizerModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-xs font-semibold text-slate-200 hover:text-amber-300 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{t.visualizer}</span>
          </button>

          {/* Quote Basket Trigger */}
          <button
            onClick={openInquiryModal}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-95 border border-amber-300/30"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden xs:inline">{t.inquiryList}</span>
            {inquiryCount > 0 && (
              <span className="bg-slate-950 text-amber-400 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-400/50 font-mono">
                {inquiryCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-amber-500/20 px-4 py-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                activePage === 'catalog' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => {
                onNavigate('products-catalog');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                activePage === 'products-catalog' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              گالری کاتالوگ
            </button>
            <button
              onClick={() => {
                onNavigate('standards');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                activePage === 'standards' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              استانداردها
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                activePage === 'about' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              درباره ما
            </button>
            <button
              onClick={() => {
                onNavigate('portfolio');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                activePage === 'portfolio' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              نمونه‌کارها
            </button>
            <button
              onClick={() => {
                onNavigate('faq');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold ${
                activePage === 'faq' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              سوالات متداول
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold col-span-2 text-center"
            >
              تماس با ما و استعلام پروژه
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
