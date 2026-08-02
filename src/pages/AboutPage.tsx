import React from 'react';
import { Award, ShieldCheck, CheckCircle2, Layers, Building, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-right dir-rtl">
      
      {/* Hero Header */}
      <div className="border-b border-slate-800 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Award className="w-4 h-4 text-amber-400" />
          <span>پیشرو در تولید پرسلان‌های معمارانه و اسلب</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          درباره صنایع کاشی و سرامیک الماس سرام
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
          تلفیق دانش و هنر ایرانی با مدرن‌ترین فناوری‌های تولید پرسلان جهان جهت خلق سطوحی استوار، لوکس و ماندگار.
        </p>
      </div>

      {/* Main Narrative & Story */}
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          <h2 className="text-2xl font-black text-white">داستان برند و فلسفه کیفیت الماس سرام</h2>
          <p>
            شرکت صنایع کاشی و سرامیک الماس سرام با هدف ارتقای استانداردهای ساختمانی و تامین نیاز معماران برجسته کشور به سرامیک‌های اسلب و پرسلان‌های لوکس تاسیس گردید. این مجموعه با بهره‌گیری از تجهیزات مدرن پرس و لعاب‌های کریستالی برتر جهان، موفق به تولید محصولات پرسلان با جذب آب زیر ۰.۱ درصد (Zero Water Absorption) گردیده است.
          </p>
          <p>
            تمرکز اصلی کارخانه بر تولید ابعاد استاندارد صادراتی از جمله اسلب‌های ۶۰x۱۲۰ و ۱۰۰x۱۰۰ سانتی‌متر با برش‌های دقیق رکتیفاید (Rectified) می‌باشد که چیدمانی کاملاً یکدست و بدون بند را برای پروژه‌های تجاری، هتل‌ها و برج‌های مسکونی فاخر به ارمغان می‌آورد.
          </p>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
              alt="Almas Ceram Quality Assurance"
              className="w-full h-80 object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Quality Standards Pillars */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h3 className="text-xl font-extrabold text-white text-center">تعهدات کیفی و استانداردهای آزمایشگاهی</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">استاندارد ISO 10545</h4>
            <p className="text-slate-400 text-xs font-light leading-relaxed">
              ارزیابی کامل استحکام خمشی، جذب آب و مقاومت در برابر لکه‌ها و مواد شیمیایی.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">برش لیزری رکتیفاید</h4>
            <p className="text-slate-400 text-xs font-light leading-relaxed">
              دقت میلی‌متری در ابعاد جهت نصب بدون بند در پروژه‌های لوکس.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">تنوع فیس تا ۱۶ الگوی طبیعی</h4>
            <p className="text-slate-400 text-xs font-light leading-relaxed">
              تکرار نكردن طرح‌ها برای ایجاد حس طبیعی سنگ مرمر و بتن.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">نشان انطباق CE صادراتی</h4>
            <p className="text-slate-400 text-xs font-light leading-relaxed">
              مجوز صادرات به کشورهای اروپایی، حاشیه خلیج فارس و همسایگان.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
