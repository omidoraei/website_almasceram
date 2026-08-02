import React from 'react';
import { FilterState } from '../types/tile';
import { SIZES } from './Header';
import { Filter, RotateCcw, Check, Layers, Sparkles } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  availableFinishes: string[];
  availableBodyTypes: string[];
  availableCollections: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onResetFilters,
  availableFinishes,
  availableBodyTypes,
  availableCollections
}) => {
  const toggleSize = (sz: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(sz);
      const newSizes = exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz];
      return { ...prev, sizes: newSizes };
    });
  };

  const toggleFinish = (finish: string) => {
    setFilters((prev) => {
      const exists = prev.finishes.includes(finish);
      const newFinishes = exists ? prev.finishes.filter((f) => f !== finish) : [...prev.finishes, finish];
      return { ...prev, finishes: newFinishes };
    });
  };

  return (
    <aside className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 space-y-6 text-right text-slate-100 shadow-xl">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <h3 className="font-extrabold text-sm text-slate-100">فیلترهای پیشرفته کاتالوگ</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>حذف فیلترها</span>
        </button>
      </div>

      {/* Size Filter (Mandatory Exact Sizes) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
          <span>سایزهای محصول (CM)</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">الزامی</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.filter((s) => s !== 'همه سایزها').map((sz) => {
            const isChecked = filters.sizes.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between border transition-all ${
                  isChecked
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{sz}</span>
                {isChecked && <Check className="w-3 h-3 text-slate-950" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Finish Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-200">نوع سطح (Surface Finish):</label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableFinishes.map((fn) => {
            const isChecked = filters.finishes.includes(fn);
            return (
              <button
                key={fn}
                onClick={() => toggleFinish(fn)}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-medium text-right flex items-center justify-between border transition-all ${
                  isChecked
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <span className="line-clamp-1">{fn}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">نوع بدنه (Body Type):</label>
        <select
          value={filters.bodyType}
          onChange={(e) => setFilters((prev) => ({ ...prev, bodyType: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="">همه انواع بدنه</option>
          {availableBodyTypes.map((bt) => (
            <option key={bt} value={bt}>
              {bt}
            </option>
          ))}
        </select>
      </div>

      {/* Collection Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">کالکشن‌ها:</label>
        <select
          value={filters.collection}
          onChange={(e) => setFilters((prev) => ({ ...prev, collection: e.target.value }))}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="">همه کالکشن‌ها</option>
          {availableCollections.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Phase 2 Hint Box */}
      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
        <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          معماری فاز ۲ آماده است
        </div>
        تغییر فیلترها مستقیماً به API پویای Supabase متصل است و پنل مدیریت آینده نیازی به Refactor نخواهد داشت.
      </div>
    </aside>
  );
};
