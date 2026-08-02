import React from 'react';
import { ArrowRight, Sparkles, AlertTriangle, Layers, Home } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
  onSelectSize: (size: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome, onSelectSize }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-8 dir-rtl">
      
      {/* 404 Glow Emblem */}
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
          <AlertTriangle className="w-12 h-12" />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-amber-400 font-mono text-sm font-bold tracking-widest block">
          ERROR 404 — PAGE NOT FOUND
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          صفحه مورد نظر در کاتالوگ یافت نشد
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          ممکن است آدرس واردشده تغییر کرده باشد یا صفحه حذف شده باشد. می‌توانید به صفحه اصلی کاتالوگ بازگردید یا بر اساس ابعاد کاشی جستجو کنید.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={onReturnHome}
          className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>بازگشت به کاتالوگ اصلی محصولات</span>
        </button>
      </div>

      {/* Quick Sizes Suggestions */}
      <div className="pt-8 border-t border-slate-800/80 space-y-3">
        <span className="text-xs text-slate-400 font-bold block">
          یا مستقیماً بر اساس ابعاد محبوب جستجو کنید:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {['100x100', '60x120', '80x80', '60x60', '30x90'].map((sz) => (
            <button
              key={sz}
              onClick={() => {
                onSelectSize(sz);
                onReturnHome();
              }}
              className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-300 font-bold hover:bg-slate-800 transition-all"
            >
              سایز {sz} cm
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
