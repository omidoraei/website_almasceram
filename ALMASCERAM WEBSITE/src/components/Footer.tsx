import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Sparkles, Building } from 'lucide-react';
import { PageView } from './Header';

interface FooterProps {
  onNavigate?: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-amber-500/20 text-slate-400 text-xs py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden dir-rtl">
      {/* Background Subtle Lighting */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-right relative z-10">
        
        {/* Brand Overview */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
              AC
            </div>
            <div>
              <span className="font-black text-base text-white block">صنایع کاشی الماس سرام</span>
              <span className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">ALMAS CERAM PORCELAIN</span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed font-light text-[11px]">
            پیشرو در تولید پرسلان‌های لعاب‌دار و فول‌بادی اسلب و ابعاد استاندارد بر پایه فناوری‌های پیشرفته ایتالیایی و استانداردهای کیفی صادراتی ISO 10545.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ناوبری سریع کاتالوگ</span>
          </h4>
          <ul className="space-y-1.5 font-mono text-[11px] text-slate-300">
            {onNavigate && (
              <>
                <li>
                  <button onClick={() => onNavigate('products-catalog')} className="hover:text-amber-300 transition-colors">
                    • گالری کامل کاتالوگ
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('standards')} className="hover:text-amber-300 transition-colors">
                    • استانداردها و گواهینامه‌ها
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-amber-300 transition-colors">
                    • درباره صنایع الماس سرام
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('portfolio')} className="hover:text-amber-300 transition-colors">
                    • نمونه‌کارهای اجراشده
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('faq')} className="hover:text-amber-300 transition-colors">
                    • سوالات متداول (FAQ)
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Technical Standards */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>استانداردها و کیفیت</span>
          </h4>
          <p className="text-slate-400 text-[11px] leading-relaxed font-light">
            • نشان استاندارد ملی ایران INSO 25
            <br />
            • مدیریت کیفیت ISO 9001:2015
            <br />
            • مقاومت جذب آب ISO 10545-3 (جذب زیر ۰.۱٪)
            <br />• گواهی انطباق صادراتی CE اتحادیه اروپا
          </p>
        </div>

        {/* Showroom & Contact */}
        <div className="space-y-3.5">
          <h4 className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>دفتر مرکزی و فروشگاه</span>
          </h4>
          <div className="space-y-2 text-[11px] text-slate-300">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>تلفن: ۰۲۱-۸۸۸۸۴۴۲۲ / ۰۲۱-۸۸۸۸۴۴۲۳</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>ایمیل: info@almasceram.com</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>تهران، خیابان ملاصدرا، پلاک ۱۲۰</span>
            </p>

            {onNavigate && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[10px] text-slate-400">
                <button onClick={() => onNavigate('privacy')} className="hover:text-amber-300 transition-colors">
                  حریم خصوصی
                </button>
                <span>|</span>
                <button onClick={() => onNavigate('terms')} className="hover:text-amber-300 transition-colors">
                  شرایط و قوانین
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>© ۲۰۲۵ کلیه حقوق برای صنایع کاشی و سرامیک الماس سرام محفوظ است.</span>
        <span className="font-mono text-amber-400/80">ALMAS CERAM PORCELAIN TILES</span>
      </div>
    </footer>
  );
};
