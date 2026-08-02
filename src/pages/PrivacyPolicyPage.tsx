import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-right dir-rtl">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>سند حریم خصوصی و حفاظت از اطلاعات</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          سیاست حریم خصوصی (Privacy Policy)
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          تعهدات صنایع کاشی الماس سرام به حفاظت از داده‌های شخصی و اطلاعات تماس ثبت‌شده مشتریان
        </p>
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-6 text-xs text-slate-300 leading-relaxed font-light">
        
        {/* Section 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۱. جمع‌آوری و ذخیره‌سازی اطلاعات شخصی</h2>
          <p className="text-slate-400">
            [متن حقوقی نهایی مربوط به شیوه جمع‌آوری نام، شماره تماس و اطلاعات پروژه در فرم‌های استعلام قیمت که توسط مشاور حقوقی شرکت تایید شده است، در این بخش قرار می‌گیرد.]
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۲. استفاده از اطلاعات در فرایند استعلام قیمت</h2>
          <p className="text-slate-400">
            [متن حقوقی نحوه استفاده کارشناسان فروش الماس سرام از شماره تماس جهت ارسال فاکتور رسمی، مشاوره انتخاب سایز و نمونه کاشی در این بخش قرار می‌گیرد.]
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۳. امنیت داده‌ها و عدم افشای اطلاعات به ثالث</h2>
          <p className="text-slate-400">
            [متن تعهدات امنیتی دیتابیس Supabase و عدم فروش یا ارائه اطلاعات مشتریان به اشخاص ثالث در این بخش قرار می‌گیرد.]
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۴. کوکی‌ها و ابزارهای تحلیل رفتار کاربر (Google Analytics)</h2>
          <p className="text-slate-400">
            [توضیحات استفاده از کوکی‌های فنی جهت بهبود تجربه کاربری و آنالیتیکس آمار بازدیدها بدون جمع‌آوری شناسه شخصی در این بخش قرار می‌گیرد.]
          </p>
        </div>
      </div>
    </div>
  );
};
