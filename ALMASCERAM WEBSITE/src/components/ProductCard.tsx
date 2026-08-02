import React from 'react';
import { Product } from '../types/tile';
import { useLanguage } from '../i18n/LanguageContext';
import { Layers, Eye, Plus, Check, Scale } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (p: Product) => void;
  onAddToInquiry: (p: Product) => void;
  isInInquiry: boolean;
  onToggleCompare: (p: Product) => void;
  isCompared: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToInquiry,
  isInInquiry,
  onToggleCompare,
  isCompared
}) => {
  const { language, t } = useLanguage();

  // Multi-lingual Title Fallback Strategy: English/Arabic if available, otherwise Persian
  const localizedTitle = language === 'en' 
    ? (product.title_en || product.title_fa) 
    : language === 'ar' 
    ? (product.title_ar || product.title_fa) 
    : product.title_fa;

  return (
    <div className="group bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/15 flex flex-col backdrop-blur-sm">
      {/* Image Stage */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(product)}>
        <img
          src={product.image_url}
          alt={localizedTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 right-3 left-3 flex justify-between items-center pointer-events-none">
          <span className="bg-slate-950/90 backdrop-blur-md text-amber-300 border border-amber-500/30 font-mono font-bold text-xs px-2.5 py-1 rounded-full shadow">
            {product.size} cm
          </span>
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md shadow">
            {product.surface_finish}
          </span>
        </div>

        {/* Face Variance Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-slate-200 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700/60">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold">{product.faces_count} {t.facesCountLabel}</span>
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/50 backdrop-blur-[2px]">
          <span className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-2xl transition-all">
            <Eye className="w-4 h-4" />
            <span>{t.quickView}</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between text-right space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-amber-400/90 font-mono mb-1">
            <span>{t.productCode}: {product.code}</span>
            <span className="text-slate-400 font-sans">{product.collection_name}</span>
          </div>

          <h3 
            onClick={() => onOpenDetail(product)}
            className="font-extrabold text-slate-100 text-base group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer"
          >
            {localizedTitle}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1 font-light mt-1">
            {product.body_type} — {t.thickness} {product.thickness_mm} mm
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => onAddToInquiry(product)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              isInInquiry
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
            }`}
          >
            {isInInquiry ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.inInquiry}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addToInquiry}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleCompare(product)}
            className={`p-2.5 rounded-xl text-xs border transition-all ${
              isCompared
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title={t.compare}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
