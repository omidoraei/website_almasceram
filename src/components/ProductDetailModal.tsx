import React, { useState } from 'react';
import { Product } from '../types/tile';
import { 
  X, Layers, CheckCircle2, Download, ShieldCheck, Plus, Check, FileText, 
  Sparkles, Scale, Maximize2, MessageCircle, ChevronLeft, ChevronRight, Award, Box
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToInquiry: (p: Product) => void;
  isInInquiry: boolean;
  onToggleCompare: (p: Product) => void;
  isCompared: boolean;
  allProducts?: Product[];
  onSelectProduct?: (p: Product) => void;
}

const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '989121112233';

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToInquiry,
  isInInquiry,
  onToggleCompare,
  isCompared,
  allProducts = [],
  onSelectProduct
}) => {
  if (!product) return null;

  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const [activeStageTab, setActiveStageTab] = useState<'faces' | 'ambiance' | 'specs'>('faces');
  const [isZoomed, setIsZoomed] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Related products (same size or same collection)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.size === product.size || p.collection_code === product.collection_code))
    .slice(0, 4);

  const currentFaceImage = product.face_images && product.face_images[activeFaceIndex] 
    ? product.face_images[activeFaceIndex] 
    : product.image_url;

  // Pre-filled WhatsApp Link for this exact product
  const rawWhatsAppMsg = TRANSLATIONS.fa.whatsAppMessageProduct(product.title_fa, product.code, product.size);
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(rawWhatsAppMsg)}`;

  const handleDownloadDatasheet = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      window.print();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto dir-rtl">
      <div className="relative w-full max-w-5xl bg-slate-900/95 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[94vh] flex flex-col">
        
        {/* Top Header Bar & Breadcrumbs */}
        <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono overflow-x-auto no-scrollbar">
            <span>صفحه اصلی</span>
            <ChevronLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>محصولات</span>
            <ChevronLeft className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-300 font-bold">{product.size} cm</span>
            <ChevronLeft className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-100 font-bold font-sans line-clamp-1">{product.title_fa}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Top Stage Grid: Gallery (Left) + Core Details & CTAs (Right) */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Column (Desktop: Vertical Thumbnail Strip + Main Image Stage) */}
            <div className="md:col-span-7 space-y-3">
              
              {/* Tab Selector Bar */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold text-slate-300">
                <button
                  onClick={() => setActiveStageTab('faces')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeStageTab === 'faces' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'hover:text-amber-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>فیس‌های متغیر ({product.faces_count})</span>
                </button>

                <button
                  onClick={() => setActiveStageTab('ambiance')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeStageTab === 'ambiance' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'hover:text-amber-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>رندر دکوراسیون داخلی</span>
                </button>
              </div>

              {/* Main Visual Display Stage */}
              <div className="relative aspect-[4/3] rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 group shadow-2xl">
                <img
                  src={
                    activeStageTab === 'faces'
                      ? currentFaceImage
                      : product.ambiance_images && product.ambiance_images[0]
                      ? product.ambiance_images[0]
                      : product.image_url
                  }
                  alt={product.title_fa}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Floating Image Stage Overlay Badges */}
                <div className="absolute top-3 right-3 left-3 flex justify-between items-center pointer-events-none">
                  <span className="bg-slate-950/90 backdrop-blur-md text-amber-300 border border-amber-500/40 font-mono font-black text-xs px-3 py-1 rounded-full shadow">
                    {product.size} cm
                  </span>
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md shadow">
                    {product.surface_finish}
                  </span>
                </div>

                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-2 rounded-xl text-slate-300 hover:text-white border border-slate-800 shadow"
                  title="بزرگنمایی بافت کاشی"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Face Thumbnails Switcher */}
              {activeStageTab === 'faces' && product.face_images && product.face_images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    انتخاب الگوی فیس متغیر (Random Face Variation):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.face_images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFaceIndex(idx)}
                        className={`relative w-16 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeFaceIndex === idx
                            ? 'border-amber-400 ring-2 ring-amber-500/40 scale-105'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Face ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 bg-slate-950/90 text-[9px] text-amber-300 px-1 rounded font-mono font-bold">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Core Details & CTA Column */}
            <div className="md:col-span-5 space-y-5 text-right">
              <div>
                <span className="text-xs text-amber-400 font-bold font-mono block mb-1">
                  کد کالا: {product.code} | {product.collection_name}
                </span>
                <h1 className="text-2xl font-black text-white">{product.title_fa}</h1>
                <p className="text-xs text-slate-400 font-mono mt-1">{product.title_en}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {product.description || 'تولیدشده با عالی‌ترین لعاب‌های کریستالی ایتالیایی و بدنه مقاوم پرسلانی. مناسب برای پروژه‌های معمارانه و لوکس.'}
              </p>

              {/* Specs Metrics Grid */}
              <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">ابعاد محصول:</span>
                  <span className="font-mono font-bold text-amber-300">{product.size} cm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">نوع سطح (Finish):</span>
                  <span className="font-bold text-slate-100">{product.surface_finish}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">نوع بدنه (Body):</span>
                  <span className="text-slate-200">{product.body_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">تنوع فیس متغیر:</span>
                  <span className="font-mono font-bold text-amber-400">{product.faces_count} فیس</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">جذب آب آزمایشگاهی:</span>
                  <span className="font-mono font-bold text-emerald-400">{product.water_absorption}</span>
                </div>
              </div>

              {/* CTAs Cluster */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => onAddToInquiry(product)}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                    isInInquiry
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  {isInInquiry ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>افزوده شده به لیست استعلام قیمت</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>افزودن به سبد استعلام قیمت پروژه</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp Pre-filled Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-extrabold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>استعلام و مشاوره مستقیم در واتساپ</span>
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      isCompared
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isCompared ? 'در مقایسه' : 'مقایسه محصول'}</span>
                  </button>

                  <button
                    onClick={handleDownloadDatasheet}
                    disabled={downloadingPdf}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800/80 border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{downloadingPdf ? 'در حال دریافت...' : 'دانلود کاتالوگ PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Showcase */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                <span>محصولات مرتبط و هم‌سایز</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct && onSelectProduct(rel)}
                    className="group bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-2.5 rounded-2xl cursor-pointer transition-all text-right space-y-2"
                  >
                    <img src={rel.image_url} alt={rel.title_fa} className="w-full h-24 object-cover rounded-xl" />
                    <div className="font-bold text-white text-xs line-clamp-1 group-hover:text-amber-300">
                      {rel.title_fa}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono">
                      کد: {rel.code} | {rel.size} cm
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee Bar */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-center text-[11px] text-slate-400 flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            ضمانت کیفیت و اصالت پرسلان الماس سرام
          </span>
          <span className="font-mono text-slate-500">ALMAS CERAM DATASHEET v3.0</span>
        </div>
      </div>
    </div>
  );
};
