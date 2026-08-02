import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SizeGridShowcaseProps {
  onSelectSize: (size: string) => void;
}

const SIZE_CATEGORIES = [
  {
    size: '100x100',
    titleFa: 'اسلب مگا سایز',
    subtitleFa: 'پرسلان بزرگ ۱۰۰x۱۰۰ بدون بند',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    useCase: 'سالن پذیرایی لوکس و لابی هتل'
  },
  {
    size: '60x120',
    titleFa: 'پرسلان مستطیلی اسلب',
    subtitleFa: 'سایز محبوب ۶۰x۱۲۰ سوپر پولیش',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    useCase: 'کف و دیوار سرویس و آشپزخانه'
  },
  {
    size: '80x80',
    titleFa: 'مربع بزرگ ۸۰x۸۰',
    subtitleFa: 'پرسلان پیترا گری و تراورتن',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    useCase: 'کف اداری، تجاری و مسکونی'
  },
  {
    size: '60x60',
    titleFa: 'مربع استاندارد ۶۰x۶۰',
    subtitleFa: 'طرح بتن آرشیتکچر و ترازو',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    useCase: 'محیط‌های پرتردد و دفتر کار'
  },
  {
    size: '30x90',
    titleFa: 'کاشی دیواری ۳۰x۹۰',
    subtitleFa: 'بدنه سفید دکور دکوراتیو',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    useCase: 'دیوار سرویس بهداشتی و حمام'
  },
  {
    size: '40x40',
    titleFa: 'سرامیک کف ۴۰x۴۰',
    subtitleFa: 'کف شیب‌بندی حمام و بالکن',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    useCase: 'تراس، تراس گاردن و بالکن'
  },
  {
    size: '30x30',
    titleFa: 'پرسلان ۳۰x۳۰ R11',
    subtitleFa: 'ضد لغزش محیط مرطوب',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    useCase: 'استخر، حمام و محیط مرطوب'
  }
];

export const SizeGridShowcase: React.FC<SizeGridShowcaseProps> = ({ onSelectSize }) => {
  return (
    <section className="py-16 bg-slate-950 border-b border-amber-500/20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold font-mono mb-2">
              <Sparkles className="w-4 h-4" />
              <span>PRODUCTION SIZES GRID</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              دسته‌بندی ابعاد استاندارد تولید الماس سرام
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-light max-w-md leading-relaxed">
            انتخاب کاشی بر اساس سایز پروژه. از اسلب‌های بزرگ ۱۰۰x۱۰۰ بدون بند تا پرسلان‌های ضد لغزش R11 سایز ۳۰x۳۰.
          </p>
        </div>

        {/* Visual Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIZE_CATEGORIES.map((cat) => (
            <div
              key={cat.size}
              onClick={() => onSelectSize(cat.size)}
              className="group relative rounded-2xl overflow-hidden border border-slate-800/90 hover:border-amber-500/60 bg-slate-900 aspect-[16/11] cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/15"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.titleFa}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent group-hover:via-slate-950/40 transition-all" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md text-amber-300 border border-amber-500/30 font-mono font-black text-xs px-3 py-1 rounded-full shadow">
                {cat.size} cm
              </div>

              {/* Content Box */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-right">
                <span className="text-[11px] text-amber-400 font-medium mb-1 block">{cat.subtitleFa}</span>
                <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {cat.titleFa}
                </h3>
                <p className="text-xs text-slate-400 font-light mt-1 flex items-center justify-between">
                  <span>{cat.useCase}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
