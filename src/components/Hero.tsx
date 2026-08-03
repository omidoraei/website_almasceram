import React, { useState } from 'react';
import { Layers, Download, Sparkles, ShieldCheck, ArrowRight, Eye, CheckCircle2, Zap, TrendingUp, Award } from 'lucide-react';
import { AnimatedSection } from './ui/AnimatedSection';
import { FadeIn } from './ui/FadeIn';
import { LuxuryButton } from './ui/LuxuryButton';
import { LuxuryCard } from './ui/LuxuryCard';
import { StatBadge } from './ui/StatBadge';

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
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border-b border-amber-500/20 py-20 lg:py-32 text-right dir-rtl">
      
      {/* Ambient Lighting Glows - Enhanced */}
      <div className="orb-light orb-amber w-[800px] h-[800px] top-0 right-[-200px]" />
      <div className="orb-light orb-amber w-[600px] h-[600px] bottom-0 left-[-100px]" style={{ opacity: 0.08 }} />
      
      {/* Animated Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(245, 158, 11, 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Statement & CTA Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Premium Badge with Animation */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-luxury border-amber-500/30 text-amber-300 text-xs font-black shadow-2xl animate-float">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="tracking-wide">کاتالوگ تخصصی کاشی و سرامیک پرسلان ۲۰۲۵ - ۲۰۲۶</span>
            </div>

            {/* Headline with Gradient Text */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              درخشش بی‌بدیل و ماندگار در
              <span className="block mt-4 gradient-text-gold font-display">
                کاتالوگ رسمی الماس سرام
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl font-light">
              تولیدکننده پرسلان‌های اسلب، فول‌بادی و لعاب‌دار لوکس نمای ساختمان، سالن و دیوارهای داخلی در سایزهای استاندارد بین‌المللی همراه با تنوع فیس‌های طبیعی (Random Faces).
            </p>

            {/* Metric Quality Badges Grid - Enhanced */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="glass-luxury rounded-3xl p-5 backdrop-blur-xl card-luxury group">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="gradient-text-gold font-mono text-2xl font-black block">0.1% &gt;</span>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-amber-300 transition-colors">جذب آب (E ≤ 0.5%)</span>
              </div>

              <div className="glass-luxury rounded-3xl p-5 backdrop-blur-xl card-luxury group">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span className="gradient-text-gold font-mono text-2xl font-black block">۷ سایز</span>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-amber-300 transition-colors">استاندارد اصلی تولید</span>
              </div>

              <div className="glass-luxury rounded-3xl p-5 backdrop-blur-xl card-luxury group">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="gradient-text-gold font-mono text-2xl font-black block">تا ۱۶ فیس</span>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-amber-300 transition-colors">تنوع رگه‌های طبیعی</span>
              </div>

              <div className="glass-luxury rounded-3xl p-5 backdrop-blur-xl card-luxury group">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span className="gradient-text-gold font-mono text-xl font-black block">رکتیفاید</span>
                </div>
                <span className="text-slate-400 text-xs font-medium group-hover:text-amber-300 transition-colors">برش لیزری بدون بند</span>
              </div>
            </div>

            {/* CTA Action Buttons - Premium Style */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                onClick={openVisualizerModal}
                className="btn-luxury-primary flex items-center gap-3"
              >
                <Layers className="w-5 h-5" />
                <span className="text-base">شبیه‌ساز آنلاین چیدمان محیطی</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-luxury-secondary flex items-center gap-2"
              >
                <span className="text-base">مشاهده کامل کاتالوگ</span>
                <ArrowRight className="w-5 h-5 rotate-180 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Right Interactive Tile Preview Stage - Enhanced */}
          <div className="lg:col-span-5 relative">
            
            {/* Stage Frame Container - Luxury Design */}
            <div className="relative mx-auto max-w-md rounded-[2rem] p-1.5 bg-gradient-to-b from-amber-400/50 via-amber-500/20 to-transparent shadow-2xl space-y-4 border-animated">
              
              {/* Interactive Sample Tile Selector Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
                {HERO_TILE_PREVIEWS.map((tile, idx) => (
                  <button
                    key={tile.size}
                    onClick={() => {
                      setActivePreviewIndex(idx);
                      onSelectSize(tile.size);
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-black whitespace-nowrap transition-all duration-300 ${
                      activePreviewIndex === idx
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg scale-105'
                        : 'glass-luxury text-slate-400 hover:text-white hover:border-amber-500/40'
                    }`}
                  >
                    {tile.size} cm
                  </button>
                ))}
              </div>

              {/* Live Preview Image Stage - Enhanced */}
              <div className="glass-luxury rounded-[1.5rem] overflow-hidden border border-amber-500/20 relative group shadow-2xl">
                <div className="image-zoom-container">
                  <img
                    src={activeTile.image}
                    alt={activeTile.title}
                    className="w-full h-96 sm:h-[28rem] object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-8">
                  <div className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-sm font-black mb-3 self-start shadow-lg">
                    سایز {activeTile.size} | {activeTile.finish}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">{activeTile.title}</h3>
                  <p className="text-sm text-slate-200 font-light">{activeTile.useCase}</p>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-slate-950/60 backdrop-blur-[2px]">
                  <button className="btn-luxury-primary flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-5 h-5" />
                    <span>مشاهده سریع</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Database Live Badge - Enhanced */}
            <div className="absolute -bottom-6 -right-6 glass-luxury p-5 rounded-3xl shadow-2xl backdrop-blur-xl border-amber-500/30 flex items-center gap-4 animate-float card-luxury">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-amber-400 border border-amber-500/40 glow-amber-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white">{totalProductsCount} محصول ثبت‌شده</p>
                <p className="text-[11px] text-amber-400 font-mono font-bold">Supabase Postgres Live</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
