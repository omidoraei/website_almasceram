import React, { useState } from 'react';
import { Layers, Download, Sparkles, ShieldCheck, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onSelectSize: (size: string) => void;
  openArchModal: () => void;
  openVisualizerModal: () => void;
  totalProductsCount: number;
}

const HERO_TILE_PREVIEWS = [
  {
    size: '100x100',
    title: 'پرسلان اسلب ۱۰۰x۱۰۰ اونیکس رویال',
    finish: 'سوپر پولیش',
    useCase: 'سالن‌های پذیرایی لوکس و لابی هتل',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    size: '60x120',
    title: 'پرسلان ۶۰x۱۲۰ کلکته گلد سوپر براق',
    finish: 'براق کریستالی',
    useCase: 'کف سالن و دیوار سرویس‌های مستر',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'
  },
  {
    size: '80x80',
    title: 'سرامیک پرسلان ۸۰x۸۰ پیترا گری مات',
    finish: 'مات مخملی',
    useCase: 'پروژه‌های اداری و تجاری مدرن',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'
  },
  {
    size: '60x60',
    title: 'سرامیک ۶۰x۶۰ بتن آرشیتکچر',
    finish: 'مات مدرن',
    useCase: 'دفاتر کار و فضاهای پرتردد',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
  }
];

export const Hero: React.FC<HeroProps> = ({
  onSelectSize,
  openArchModal,
  openVisualizerModal,
  totalProductsCount
}) => {
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const activeTile = HERO_TILE_PREVIEWS[activePreviewIndex];

  return (
    <div className="relative overflow-hidden bg-slate-950 border-b border-amber-500/20 py-16 lg:py-24 text-right dir-rtl">
      
      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Statement & CTA Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>کاتالوگ تخصصی کاشی و سرامیک پرسلان ۲۰۲۵ - ۲۰۲۶</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight">
              درخشش بی‌بدیل و ماندگار در
              <span className="block mt-2 bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                کاتالوگ رسمی الماس سرام
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl font-light">
              تولیدکننده پرسلان‌های اسلب، فول‌بادی و لعاب‌دار لوکس نمای ساختمان، سالن و دیوارهای داخلی در سایزهای استاندارد بین‌المللی همراه با تنوع فیس‌های طبیعی (Random Faces).
            </p>

            {/* Metric Quality Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-lg font-black block">0.1% &gt;</span>
                <span className="text-slate-400 text-xs font-light">جذب آب (E ≤ 0.5%)</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-lg font-black block">۷ سایز</span>
                <span className="text-slate-400 text-xs font-light">استاندارد اصلی تولید</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-lg font-black block">تا ۱۶ فیس</span>
                <span className="text-slate-400 text-xs font-light">تنوع رگه‌های طبیعی</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md">
                <span className="text-amber-400 font-mono text-lg font-black block">رکتیفاید</span>
                <span className="text-slate-400 text-xs font-light">برش لیزری بدون بند</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={openVisualizerModal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 border border-amber-300/30"
              >
                <Layers className="w-4 h-4" />
                <span>شبیه‌ساز آنلاین چیدمان محیطی</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <span>مشاهده کامل کاتالوگ</span>
                <ArrowRight className="w-4 h-4 rotate-180 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Right Interactive Tile Preview Stage */}
          <div className="lg:col-span-5 relative">
            
            {/* Stage Frame Container */}
            <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-b from-amber-400/40 via-amber-500/10 to-transparent shadow-2xl space-y-3">
              
              {/* Interactive Sample Tile Selector Buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 px-1">
                {HERO_TILE_PREVIEWS.map((tile, idx) => (
                  <button
                    key={tile.size}
                    onClick={() => {
                      setActivePreviewIndex(idx);
                      onSelectSize(tile.size);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold whitespace-nowrap transition-all ${
                      activePreviewIndex === idx
                        ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {tile.size} cm
                  </button>
                ))}
              </div>

              {/* Live Preview Image Stage */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative group shadow-2xl">
                <img
                  src={activeTile.image}
                  alt={activeTile.title}
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                  <div className="inline-block px-3 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black mb-2 self-start shadow">
                    سایز {activeTile.size} | {activeTile.finish}
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-1">{activeTile.title}</h3>
                  <p className="text-xs text-slate-300 font-light">{activeTile.useCase}</p>
                </div>
              </div>
            </div>

            {/* Floating Database Live Badge */}
            <div className="absolute -bottom-4 -right-4 bg-slate-900/95 border border-amber-500/30 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-100">{totalProductsCount} محصول ثبت‌شده</p>
                <p className="text-[10px] text-amber-400/90 font-mono">Supabase Postgres Live</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
