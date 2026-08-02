import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, Sparkles } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 1,
    category: 'product',
    question: 'تفاوت پرسلان فول‌بادی (Full Body) با پرسلان لعاب‌دار چیست؟',
    answer: 'در پرسلان فول‌بادی، ترکیب رنگ و بدنه در تمام ضخامت کاشی یکدست است و در صورت خط و خش عمیق رنگ تغییر نمی‌کند. پرسلان لعاب‌دار دارای یک لایه لعاب کریستالی محافظ روی بدنه است که جلاپذیری و شفافیت عالی مثل اونیکس رویال را فراهم می‌سازد.'
  },
  {
    id: 2,
    category: 'product',
    question: 'آیا کاشی‌های الماس سرام برای نمای بیرونی و مناطق سردسیر مناسب هستند؟',
    answer: 'بله، تمامی محصولات پرسلانی الماس سرام دارای جذب آب زیر ۰.۱ درصد (Zero Water Absorption) بوده و در برابر شوک حرارتی، شوک برودتی و یخ‌زدگی ۱۰۰٪ مقاوم هستند.'
  },
  {
    id: 3,
    category: 'installation',
    question: 'برش لیزری رکتیفاید (Rectified) چه مزیتی در نصب دارد؟',
    answer: 'برش رکتیفاید باعث گونیا بودن کامل و لبه‌های ۹۰ درجه کاشی می‌شود، بنابراین کاشی‌ها بدون نیاز به بندکشی عریض و با حداقل بند (زیر ۱ میلی‌متر) چیده می‌شوند و فضایی یکدست ایجاد می‌کنند.'
  },
  {
    id: 4,
    category: 'installation',
    question: 'چند فیس متغیر (Random Faces) در کاتالوگ الماس سرام وجود دارد؟',
    answer: 'بر اساس کد محصول، از ۴ تا ۱۶ الگوی فیس متغیر در تولید استفاده می‌شود تا رگه‌های مرمر و بافت بتن بدون تکرار یکنواخت در پروژه چیده شوند.'
  },
  {
    id: 5,
    category: 'ordering',
    question: 'چگونه می‌توانم درخواست نمونه فیزیکی کاشی یا استعلام قیمت پروژه ثبت کنم؟',
    answer: 'شما می‌توانید از دکمه «لیست استعلام قیمت» در سایت، محصولات مورد نظر را اضافه کرده یا فرم تماس با ما را تکمیل نمایید تا کارشناسان فروش با شما تماس بگیرند.'
  }
];

export const FaqPage: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.question.includes(searchQuery) ||
      item.answer.includes(searchQuery)
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-right dir-rtl">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>مرکز پاسخگویی به سوالات خریداران و معماران</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          سوالات متداول (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          پاسخ به سوالات رایج درباره مشخصات فنی پرسلان‌ها، برش رکتیفاید، جذب آب و نحوه سفارش.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجوی سوال یا کلمه کلیدی..."
          className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pr-11 pl-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 text-right font-extrabold text-white text-xs sm:text-sm flex items-center justify-between gap-4 hover:text-amber-300 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed font-light border-t border-slate-800/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
