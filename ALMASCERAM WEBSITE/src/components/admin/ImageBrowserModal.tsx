import React, { useState } from 'react';
import { X, Image, Check, Search, Sparkles, ShieldCheck, Layers, Building } from 'lucide-react';

interface ImageBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  title?: string;
}

const CATEGORIZED_IMAGES = [
  {
    category: 'certificates',
    categoryFa: 'گواهی‌ها و استانداردهای ISO',
    images: [
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', title: 'گواهی استاندارد بین‌المللی ISO 10545' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', title: 'گواهی انطباق صادراتی CE اروپا' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', title: 'گواهی مدیریت کیفیت ISO 9001:2015' }
    ]
  },
  {
    category: 'slabs',
    categoryFa: 'اسلب مرمر و اونیکس رویال',
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', title: 'اونیکس رویال ۱۰۰x۱۰۰ سوپر پولیش' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', title: 'کلکته گلد ۶۰x۱زو براق کریستالی' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', title: 'اسلب استاتواریو مگاماربل' }
    ]
  },
  {
    category: 'concrete',
    categoryFa: 'بتن، پیترا گری و تراورتن',
    images: [
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', title: 'پیترا گری مات مخملی' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', title: 'بتن اکسپوز معماری شهری' },
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', title: 'تراورتن کلاسیک کرم' }
    ]
  },
  {
    category: 'showroom',
    categoryFa: 'شوروم و کارخانه تولید',
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', title: 'شوروم مرکزی ملاصدرا' },
      { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', title: 'خطوط تولید ایتالیایی کارخانه' }
    ]
  }
];

export const ImageBrowserModal: React.FC<ImageBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'انتخاب تصویر از گالری و کتابخانه رسانه'
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const allImages = CATEGORIZED_IMAGES.flatMap((c) => c.images);

  const filteredImages = allImages.filter((img) => {
    const matchesSearch = img.title.includes(searchQuery) || img.url.includes(searchQuery);
    return matchesSearch;
  });

  const handleConfirmSelect = (url: string) => {
    onSelectImage(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto dir-rtl text-right">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی عنوان یا نوع عکس..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pr-9 pl-3 text-xs text-white placeholder-slate-500 focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
          </div>

          <span className="text-amber-300 font-mono text-[11px]">
            روی تصویر مورد نظر کلیک کنید تا آدرس آن قرار گیرد.
          </span>
        </div>

        {/* Image Grid Stage */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredImages.map((img, idx) => {
              const isSelected = selectedUrl === img.url;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedUrl(img.url)}
                  className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] bg-slate-950 ${
                    isSelected
                      ? 'border-amber-400 ring-4 ring-amber-500/30 scale-105 shadow-xl'
                      : 'border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-white font-extrabold text-[11px] line-clamp-1">{img.title}</span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 rounded-full p-1 shadow">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            {selectedUrl ? 'تصویر انتخاب گردید.' : 'یک تصویر را انتخاب کنید.'}
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold">
              انصراف
            </button>
            <button
              onClick={() => selectedUrl && handleConfirmSelect(selectedUrl)}
              disabled={!selectedUrl}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black disabled:opacity-40"
            >
              تایید و انتخاب این تصویر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
