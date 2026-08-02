import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

export const AboutSnippet: React.FC = () => {
  return (
    <section className="py-16 bg-slate-900/60 border-b border-amber-500/20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>درباره صنایع کاشی و سرامیک الماس سرام</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              تلفیق فناوری روز ایتالیا با هنر و اصالت تولید پرسلان ایرانی
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              شرکت کاشی و سرامیک الماس سرام با بهره‌گیری از خطوط تولید مدرن ایتالیایی و پرس‌های پیشرفته اسلب، انواع کاشی‌های پرسلان فول‌بادی و لعاب‌دار لوکس را مطابق با سخت‌گیرانه‌ترین استانداردهای بین‌المللی تولید می‌نماید.
            </p>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>برش لیزری رکتیفاید (Rectified)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  چیدمان بدون بند و یکدست با دقت میلی‌متری برش‌های لیزری کارخانه.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>جذب آب زیر ۰.۱ درصد (Zero Water)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  مقاومت ۱۰۰٪ در برابر یخ‌زدگی، رطوبت و سایش در نمای بیرونی و مناطق سردسیر.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تنوع فیس تا ۱۶ الگوی طبیعی</span>
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  ایجاد جلوه واقعی مرمر و بتن بدون تکرار یکنواخت طرح‌ها در پروژه.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>لعابات سوپر پولیش کریستالی</span>
                </div>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  درخشش بی‌نظیر و جلاپذیری فوق‌العاده مقاوم در برابر لکه و مواد شیمیایی.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Stage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                alt="Almas Ceram Porcelain Factory Quality"
                className="w-full h-80 sm:h-96 object-cover rounded-xl"
              />
              <div className="absolute bottom-4 right-4 left-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-amber-500/30 text-xs text-right">
                <div className="font-extrabold text-amber-300">گواهی کیفیت استاندارد ISO 10545</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  ارزیابی دقیق استحکام خمشی، جذب آب و مقاومت شیمیایی
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
