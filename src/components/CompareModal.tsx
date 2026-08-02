import React from 'react';
import { Product } from '../types/tile';
import { X, Scale, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface CompareModalProps {
  products: Product[];
  onClose: () => void;
  onRemove: (product: Product) => void;
  onAddToInquiry: (p: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  products,
  onClose,
  onRemove,
  onAddToInquiry
}) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white">مقایسه تخصصی کاشی‌های الماس سرام ({products.length} کالا)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 text-slate-400 font-normal w-36">مشخصه فنی</th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 min-w-[200px] align-top">
                    <div className="relative bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
                      <button
                        onClick={() => onRemove(p)}
                        className="absolute top-2 left-2 p-1 text-slate-400 hover:text-red-400 bg-slate-900 rounded-full"
                        title="حذف از مقایسه"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <img src={p.image_url} alt={p.title_fa} className="w-full h-24 object-cover rounded-lg" />
                      <div className="font-bold text-white text-xs">{p.title_fa}</div>
                      <div className="text-[10px] text-amber-400 font-mono">کد: {p.code}</div>
                      <button
                        onClick={() => onAddToInquiry(p)}
                        className="w-full py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px]"
                      >
                        افزودن به استعلام
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="p-3 text-amber-400 font-bold">ابعاد (سایز)</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-mono font-extrabold text-white text-center">
                    {p.size} cm
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">نوع سطح (Finish)</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-200">
                    {p.surface_finish}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">نوع بدنه</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-200">
                    {p.body_type}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">تعداد فیس متغیر</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-mono font-bold text-amber-300 text-center">
                    {p.faces_count} فیس
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">ضخامت</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-mono text-center text-slate-200">
                    {p.thickness_mm} mm
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">جذب آب</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-mono text-center text-emerald-400">
                    {p.water_absorption}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">برش لیزری (Rectified)</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-200">
                    {p.rectified ? 'بله (بدون بند)' : 'خیر'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-400">کاربردها</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-center text-amber-300 text-[11px]">
                    {p.applications ? p.applications.join('، ') : 'کف، دیوار'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
