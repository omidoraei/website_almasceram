import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, CheckCircle2, RefreshCw, X, Eye, Maximize2 } from 'lucide-react';
import { getStandards } from '../lib/api';

export const StandardsPage: React.FC = () => {
  const [standards, setStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertImage, setSelectedCertImage] = useState<string | null>(null);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const data = await getStandards();
      setStandards(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-right dir-rtl">
      
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>تضمین کیفیت و اعتبارسنجی بین‌المللی</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          استانداردها و گواهینامه‌های صنایع کاشی الماس سرام
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
          تصاویر اسناد و گواهینامه‌های رسمی ISO و پروانه‌های آزمایشگاهی کیفیت پرسلان‌های الماس سرام جهت بررسی معماران و خریداران
        </p>
      </div>

      {/* Official Certificates Visual Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
          در حال دریافت تصاویر اسناد گواهینامه‌ها...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((st) => (
            <div key={st.id} className="group bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all">
              
              {/* Certificate Image Visual Container */}
              <div 
                className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer"
                onClick={() => setSelectedCertImage(st.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80')}
              >
                <img
                  src={st.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'}
                  alt={st.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 right-3 bg-slate-950/90 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {st.code || 'ISO'}
                </span>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 backdrop-blur-[2px]">
                  <span className="bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow">
                    <Maximize2 className="w-4 h-4" />
                    <span>مشاهده سند گواهی</span>
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mt-1.5">
                    {st.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{st.status_badge || 'پروانه و گواهی رسمی معتبر'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Laboratory Test Highlights Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-black text-white">آزمون‌های شاخص آزمایشگاهی ISO 10545</h2>
            <p className="text-xs text-slate-400 mt-1">آزمايش‌شده بر روی اسلب‌ها و کاشی‌های پرسلانی الماس سرام</p>
          </div>
          <span className="text-xs text-amber-300 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            ISO 10545 LAB REPORT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">آزمون درصد جذب آب (ISO 10545-3):</span>
            <span className="text-white font-mono font-black text-sm">E ≤ 0.08% (Zero Water)</span>
            <p className="text-[11px] text-slate-400 font-light">مقاومت ۱۰۰٪ در برابر یخ‌زدگی و رطوبت نمای بیرونی.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">آزمون استحکام خمشی (ISO 10545-4):</span>
            <span className="text-white font-mono font-black text-sm">&gt; 45 N/mm² (High Resistance)</span>
            <p className="text-[11px] text-slate-400 font-light">تحمل بارهای سنگین ترافیکی در لابی‌ها و فضاهای تجاری.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">آزمون مقاومت سایشی (ISO 10545-7):</span>
            <span className="text-white font-mono font-black text-sm">PEI Class IV / V</span>
            <p className="text-[11px] text-slate-400 font-light">مناسب برای پرترددترین فضاهای اداری و تجاری.</p>
          </div>
        </div>
      </div>

      {/* Certificate Lightbox Modal */}
      {selectedCertImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-4 shadow-2xl space-y-3">
            <button
              onClick={() => setSelectedCertImage(null)}
              className="absolute top-4 left-4 p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center font-extrabold text-white text-sm pt-2">
              سند و تصویر گواهینامه رسمی صنایع الماس سرام
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={selectedCertImage} alt="Certificate Document" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
