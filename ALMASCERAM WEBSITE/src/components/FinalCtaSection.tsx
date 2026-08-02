import React from 'react';
import { MessageSquare, Layers, ShieldCheck } from 'lucide-react';

interface FinalCtaSectionProps {
  openContactModal: () => void;
  openVisualizerModal: () => void;
  openArchModal: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  openContactModal,
  openVisualizerModal,
  openArchModal
}) => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 text-right relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold mx-auto">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ارتباط مستقیم با واحد مشاوره و فروش پروژه‌های ساختمانی</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          آماده مشاوره و دریافت پیش‌فاکتور رسمی پروژه‌تان هستید؟
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          کارشناسان فنی الماس سرام آماده ارائه مشاوره انتخاب سایز، محاسبه دقیق متراژ و ارسال نمونه کاشی به سراسر کشور هستند.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={openContactModal}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-sm transition-all shadow-2xl shadow-amber-500/25 flex items-center gap-2 border border-amber-300/40"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ثبت فرم درخواست استعلام و نمونه کاشی</span>
          </button>

          <button
            onClick={openVisualizerModal}
            className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>تست چیدمان در شبیه‌ساز آنلاین</span>
          </button>
        </div>
      </div>
    </section>
  );
};
