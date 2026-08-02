import React, { useState } from 'react';
import { REACT_APPROACHES, TECHNICAL_DATA_MODEL_DOC } from '../data/architectureDocs';
import { X, Code, CheckCircle2, FileCode, Server, Database, Layers, ArrowLeft, Terminal } from 'lucide-react';

interface ArchitectureViewProps {
  onClose: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number>(4);

  const currentApproach = REACT_APPROACHES.find((a) => a.optionNumber === selectedOption) || REACT_APPROACHES[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-amber-400/90 font-mono">Senior Software Architect Review</span>
              <h2 className="text-xl font-black text-white">طراحی معماری نرم‌افزار کاتالوگ الماس سرام (ALMAS CERAM)</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* ReAct Approach Comparison Tabs */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>تحلیل ReAct: مقایسه ۴ رویکرد معماری با فرمت (Thought → Action → Observation)</span>
            </h3>

            {/* Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {REACT_APPROACHES.map((appr) => (
                <button
                  key={appr.optionNumber}
                  onClick={() => setSelectedOption(appr.optionNumber)}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                    selectedOption === appr.optionNumber
                      ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-amber-400">گزینه شماره {appr.optionNumber}</span>
                  <span className="text-xs font-bold line-clamp-2">{appr.titleFa}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    آمادگی فاز ۲: {appr.phase2Readiness}
                  </span>
                </button>
              ))}
            </div>

            {/* Detailed Selected ReAct Approach Box */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-amber-300">{currentApproach.titleFa}</h4>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px] border border-emerald-500/30">
                  {currentApproach.titleEn}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/20 space-y-2">
                  <span className="font-bold text-amber-400 block text-xs">Thought (تفکر معماری):</span>
                  <p className="text-slate-300 leading-relaxed font-light">{currentApproach.thought}</p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-blue-500/20 space-y-2">
                  <span className="font-bold text-blue-400 block text-xs">Action (پیاده‌سازی فنی):</span>
                  <p className="text-slate-300 leading-relaxed font-light">{currentApproach.action}</p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-400 block text-xs">Observation (ارزیابی):</span>
                  <p className="text-slate-300 leading-relaxed font-light">{currentApproach.observation}</p>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
                  <span className="font-bold text-emerald-400 block mb-1">مزایا:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {currentApproach.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <div className="bg-rose-950/20 border border-rose-500/30 p-3 rounded-xl">
                  <span className="font-bold text-rose-400 block mb-1">چالش‌ها:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {currentApproach.cons.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Folder Structure Diagram */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>ساختار پوشه‌بندی استاندارد پروژه (Next.js / Node.js Scalable Architecture)</span>
            </h3>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-200/90 overflow-x-auto leading-relaxed">
{`almas-ceram-catalog/
├── api/                   # لایه بک‌اند Serverless Node.js (REST API Endpoints)
│   ├── db-client.js       # کلاینت دیتابیس Supabase Postgres با خودتریمی (Self-Healing)
│   ├── products.js        # GET /api/products (فیلتر بر اساس سایز، سطح، بدنه) & POST
│   ├── collections.js     # GET /api/collections
│   └── inquiry.js         # POST /api/inquiry (ثبت پیش‌فاکتور مشتریان برای پنل ادمین)
├── src/
│   ├── components/        # کامپوننت‌های فرانت‌اند قابل استفاده مجدد
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailModal.tsx (نمایش فیس‌های چندگانه & دانلود کاتالوگ PDF)
│   │   ├── FilterSidebar.tsx (فیلترهای تخصصی سایزهای 30x30 تا 100x100)
│   │   ├── CompareModal.tsx
│   │   ├── InquiryBasketModal.tsx
│   │   ├── RoomVisualizer.tsx (شبیه‌ساز چیدمان محیطی)
│   │   └── ArchitectureView.tsx
│   ├── types/             # مدل‌های TypeScript تخصصی کاشی و سرامیک
│   │   └── tile.ts
│   ├── data/
│   └── lib/
│       └── supabase.js    # کلاینت فرانت‌اند Supabase
└── vercel.json            # کانفیگ دپلوی Vercel Serverless`}
            </pre>
          </div>

          {/* Data Model Technical Schema */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>طرح‌بندی جدول دیتابیس (Database Schema ERD & Field Definitions)</span>
            </h3>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {TECHNICAL_DATA_MODEL_DOC}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
