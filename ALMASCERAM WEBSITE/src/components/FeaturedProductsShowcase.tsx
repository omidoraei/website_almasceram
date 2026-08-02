import React from 'react';
import { Product } from '../types/tile';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface FeaturedProductsShowcaseProps {
  products: Product[];
  onOpenDetail: (p: Product) => void;
  onAddToInquiry: (p: Product) => void;
  inquiryBasket: any[];
  onToggleCompare: (p: Product) => void;
  comparedProducts: Product[];
}

export const FeaturedProductsShowcase: React.FC<FeaturedProductsShowcaseProps> = ({
  products,
  onOpenDetail,
  onAddToInquiry,
  inquiryBasket,
  onToggleCompare,
  comparedProducts
}) => {
  const featuredList = products.filter((p) => p.featured).slice(0, 6);
  const displayList = featuredList.length > 0 ? featuredList : products.slice(0, 6);

  return (
    <section className="py-16 bg-slate-950 border-b border-amber-500/20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold font-mono mb-2">
              <Sparkles className="w-4 h-4" />
              <span>FEATURED COLLECTION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              محصولات شاخص و کالکشن‌های برتر الماس سرام
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-light max-w-md leading-relaxed">
            برترین نمونه‌های پرسلان اسلب، اونیکس سوپر پولیش و کلکته گلد با بالاترین جلا و مقاومت.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((product) => {
            const isInInquiry = inquiryBasket.some((item) => item.product.id === product.id);
            const isCompared = comparedProducts.some((p) => p.id === product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
                onAddToInquiry={onAddToInquiry}
                isInInquiry={isInInquiry}
                onToggleCompare={onToggleCompare}
                isCompared={isCompared}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
