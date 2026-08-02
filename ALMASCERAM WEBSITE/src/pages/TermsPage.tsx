import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-right dir-rtl">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>شرایط و ضوابط رسمی استفاده</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          قوانین و مقررات استفاده (Terms of Use)
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          ضوابط استفاده از کاتالوگ آنلاین، پیش‌فاکتورها و حقوق مالکیت معنوی برند الماس سرام
        </p>
      </div>

      {/* Sections Skeleton */}
      <div className="space-y-6 text-xs text-slate-300 leading-relaxed font-light">
        
        {/* Section 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۱. مالكیت معنوی و تصاویر کاتالوگ</h2>
          <p className="text-slate-400">
            [متن حقوقی نهایی مربوط به حقوق کپی‌رایت تصاویر کاتالوگ، رندرها، کدهای محصولات و لوگوی الماس سرام که توسط مشاور حقوقی تایید شده است، در این بخش قرار می‌گیرد.]
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۲. شرایط پیش‌فاکتورها و استعلام قیمت</h2>
          <p className="text-slate-400">
            [متن حقوقی نحوه اعتبارسنجی قیمت‌ها و متراژ درخواستی توسط واحد فروش کارخانه و لزوم تایید نهایی قبل از بارگیری در این بخش قرار می‌گیرد.]
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <h2 className="text-sm font-extrabold text-white">۳. استانداردهای فنی و رواداری‌های نصب (ISO 10545)</h2>
          <p className="text-slate-400">
            [توضیحات فنی ضمانت کیفیت، برش رکتیفاید، درصد جذب آب زیر ۰.۱٪ و شرایط ضمانت محصول پس از نصب در این بخش قرار می‌گیرد.]
          </p>
        </div>
      </div>
    </div>
  );
};
