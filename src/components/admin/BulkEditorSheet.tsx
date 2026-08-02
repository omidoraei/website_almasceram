import React, { useState, useMemo } from 'react';
import { Product } from '../../types/tile';
import { MANDATORY_TILE_SIZES, SURFACE_FINISHES, BODY_TYPES } from '../../constants';
import { 
  Save, Search, Filter, RotateCcw, CheckSquare, Square, X,
  Trash2, RefreshCw, Sparkles, Layers, ArrowUpDown, Replace, AlertCircle, CheckCircle2 
} from 'lucide-react';

interface BulkEditorSheetProps {
  products: Product[];
  onSaveSuccess: () => void;
}

export const BulkEditorSheet: React.FC<BulkEditorSheetProps> = ({ products, onSaveSuccess }) => {
  // Staged Edits Map: productId -> Partial<Product>
  const [stagedEdits, setStagedEdits] = useState<Map<number, Partial<Product>>>(new Map());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Find & Replace Modal State
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [targetColumn, setTargetColumn] = useState<keyof Product>('title_fa');

  const [savingBatch, setSavingBatch] = useState(false);

  // Helper to get effective product data (staged edit or original DB product)
  const getEffectiveProduct = (p: Product): Product => {
    const edit = stagedEdits.get(p.id);
    return edit ? ({ ...p, ...edit } as Product) : p;
  };

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let list = products.map((p) => getEffectiveProduct(p));

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title_fa.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.collection_name.toLowerCase().includes(q)
      );
    }

    if (selectedSize) {
      list = list.filter((p) => p.size === selectedSize);
    }

    list.sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [products, stagedEdits, searchQuery, selectedSize, sortField, sortOrder]);

  // Stage a Single Cell Edit
  const handleCellEdit = (productId: number, field: keyof Product, value: any) => {
    setStagedEdits((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(productId) || {};
      newMap.set(productId, { ...existing, [field]: value });
      return newMap;
    });
  };

  // Select All Checkboxes
  const handleToggleSelectAll = () => {
    if (selectedIds.size === processedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processedProducts.map((p) => p.id)));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Execute Batch Save PATCH API
  const handleBatchSave = async () => {
    if (stagedEdits.size === 0) return;

    setSavingBatch(true);
    try {
      const updatesPayload = Array.from(stagedEdits.entries()).map(([id, fields]) => ({
        id,
        ...fields
      }));

      const res = await fetch('/api/bulk-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: updatesPayload })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ذخیره‌سازی گروهی');

      alert(data.message || 'تمامی تغییرات با موفقیت ذخیره شدند.');
      setStagedEdits(new Map());
      onSaveSuccess();
    } catch (err: any) {
      alert(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setSavingBatch(false);
    }
  };

  // Execute Bulk Action on Selected Checkboxes
  const handleBulkAction = async (action: 'set_size' | 'toggle_featured', payloadValue?: any) => {
    if (selectedIds.size === 0) return;

    try {
      const res = await fetch('/api/bulk-products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          productIds: Array.from(selectedIds),
          size: action === 'set_size' ? payloadValue : undefined,
          featured: action === 'toggle_featured' ? payloadValue : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در اجرای عملیات گروهی');

      alert(data.message || 'عملیات گروهی با موفقیت انجام شد.');
      setSelectedIds(new Set());
      onSaveSuccess();
    } catch (err: any) {
      alert(err.message || 'خطا در برقراری ارتباط');
    }
  };

  // Find & Replace Tool Execution
  const handleExecuteFindReplace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findText.trim()) return;

    let affectedCount = 0;
    const targets = selectedIds.size > 0 
      ? processedProducts.filter((p) => selectedIds.has(p.id)) 
      : processedProducts;

    targets.forEach((p) => {
      const currentVal = String(p[targetColumn] || '');
      if (currentVal.includes(findText)) {
        const newVal = currentVal.replaceAll(findText, replaceText);
        handleCellEdit(p.id, targetColumn, newVal);
        affectedCount++;
      }
    });

    alert(`عملیات جایگزینی در ${affectedCount} ردیف انجام شد (جهت ثبت نهایی دکمه "ذخیره تغییرات" را بزنید).`);
    setIsFindReplaceOpen(false);
  };

  const hasUnsavedEdits = stagedEdits.size > 0;

  return (
    <div className="space-y-4 text-right dir-rtl text-xs">
      
      {/* Top Controls & Unsaved Changes Alert Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در کد، نام، کالکشن..."
              className="bg-slate-950 border border-slate-800 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
          </div>

          {/* Quick Size Filter */}
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-amber-300 font-bold focus:border-amber-500"
          >
            <option value="">همه سایزها</option>
            {MANDATORY_TILE_SIZES.map((sz) => (
              <option key={sz} value={sz}>{sz} cm</option>
            ))}
          </select>

          {/* Find & Replace Trigger Button */}
          <button
            onClick={() => setIsFindReplaceOpen(true)}
            className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 flex items-center gap-1.5 font-bold transition-all"
          >
            <Replace className="w-4 h-4 text-amber-400" />
            <span>Find & Replace</span>
          </button>
        </div>

        {/* Unsaved Changes Indicator & Batch Save Button */}
        <div className="flex items-center gap-3">
          {hasUnsavedEdits && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-xl animate-pulse flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>{stagedEdits.size} محصول دارای تغییرات ذخیره‌نشده</span>
            </span>
          )}

          <button
            onClick={handleBatchSave}
            disabled={savingBatch || !hasUnsavedEdits}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            <span>{savingBatch ? 'در حال ذخیره‌سازی...' : 'ذخیره تمامی تغییرات (Batch Save)'}</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (When rows selected with Checkbox) */}
      {selectedIds.size > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-medium">
          <span className="text-amber-300 font-bold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>{selectedIds.size} محصول انتخاب شده است.</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">تغییر گروهی سایز:</span>
            <select
              onChange={(e) => e.target.value && handleBulkAction('set_size', e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold"
            >
              <option value="">انتخاب سایز...</option>
              {MANDATORY_TILE_SIZES.map((sz) => (
                <option key={sz} value={sz}>{sz} cm</option>
              ))}
            </select>

            <button
              onClick={() => handleBulkAction('toggle_featured', true)}
              className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
            >
              + نمایش ویژه گروهی
            </button>
          </div>
        </div>
      )}

      {/* Interactive Spreadsheet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-2xl">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
              <th className="p-3 w-10 text-center">
                <button onClick={handleToggleSelectAll}>
                  {selectedIds.size === processedProducts.length && processedProducts.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </th>
              <th className="p-3">تصویر</th>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => { setSortField('title_fa'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                نام محصول (فارسی) <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-3 cursor-pointer hover:text-white" onClick={() => { setSortField('code'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                کد کالا <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-3">سایز (CM)</th>
              <th className="p-3">نوع سطح (Finish)</th>
              <th className="p-3">نوع بدنه</th>
              <th className="p-3 text-center">تعداد فیس</th>
              <th className="p-3 text-center">ضخامت (mm)</th>
              <th className="p-3 text-center">ویژه</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {processedProducts.map((p) => {
              const isEdited = stagedEdits.has(p.id);
              const isSelected = selectedIds.has(p.id);

              return (
                <tr key={p.id} className={`transition-colors ${isEdited ? 'bg-amber-950/20' : isSelected ? 'bg-slate-950/80' : 'hover:bg-slate-950/40'}`}>
                  <td className="p-3 text-center">
                    <button onClick={() => handleToggleSelectRow(p.id)}>
                      {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-slate-700" />}
                    </button>
                  </td>

                  <td className="p-2">
                    <img src={p.image_url} alt={p.title_fa} className="w-10 h-10 object-cover rounded-lg border border-slate-800" />
                  </td>

                  {/* Inline Editable Title */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={p.title_fa}
                      onChange={(e) => handleCellEdit(p.id, 'title_fa', e.target.value)}
                      className={`w-full bg-slate-950 border rounded-lg py-1 px-2 text-xs font-bold text-white focus:border-amber-500 ${
                        isEdited ? 'border-amber-500/80 text-amber-300' : 'border-slate-800'
                      }`}
                    />
                  </td>

                  {/* Inline Editable Code */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={p.code}
                      onChange={(e) => handleCellEdit(p.id, 'code', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs font-mono font-bold text-amber-400 focus:border-amber-500 text-left"
                    />
                  </td>

                  {/* Inline Editable Size Dropdown */}
                  <td className="p-2">
                    <select
                      value={p.size}
                      onChange={(e) => handleCellEdit(p.id, 'size', e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs font-mono font-bold text-amber-300 focus:border-amber-500"
                    >
                      {MANDATORY_TILE_SIZES.map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </td>

                  {/* Inline Editable Surface Finish */}
                  <td className="p-2">
                    <select
                      value={p.surface_finish}
                      onChange={(e) => handleCellEdit(p.id, 'surface_finish', e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs text-slate-200 focus:border-amber-500"
                    >
                      {SURFACE_FINISHES.map((fn) => (
                        <option key={fn} value={fn}>{fn}</option>
                      ))}
                    </select>
                  </td>

                  {/* Inline Editable Body Type */}
                  <td className="p-2">
                    <select
                      value={p.body_type}
                      onChange={(e) => handleCellEdit(p.id, 'body_type', e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs text-slate-300 focus:border-amber-500"
                    >
                      {BODY_TYPES.map((bt) => (
                        <option key={bt} value={bt}>{bt}</option>
                      ))}
                    </select>
                  </td>

                  {/* Inline Editable Faces Count */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={p.faces_count}
                      onChange={(e) => handleCellEdit(p.id, 'faces_count', parseInt(e.target.value, 10) || 1)}
                      className="w-16 bg-slate-950 border border-slate-800 rounded-lg py-1 text-center font-mono text-xs text-slate-200 focus:border-amber-500"
                    />
                  </td>

                  {/* Inline Editable Thickness */}
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      step="0.5"
                      value={p.thickness_mm}
                      onChange={(e) => handleCellEdit(p.id, 'thickness_mm', parseFloat(e.target.value) || 10)}
                      className="w-16 bg-slate-950 border border-slate-800 rounded-lg py-1 text-center font-mono text-xs text-slate-200 focus:border-amber-500"
                    />
                  </td>

                  {/* Inline Toggle Featured Checkbox */}
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={p.featured || false}
                      onChange={(e) => handleCellEdit(p.id, 'featured', e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-amber-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Find & Replace Modal */}
      {isFindReplaceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-right">
            <button onClick={() => setIsFindReplaceOpen(false)} className="absolute top-4 left-4 p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Replace className="w-5 h-5 text-amber-400" />
              <span>ابزار Find & Replace گروهی متون</span>
            </h3>

            <form onSubmit={handleExecuteFindReplace} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">انتخاب ستون هدف:</label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-amber-300 font-bold"
                >
                  <option value="title_fa">نام محصول (فارسی)</option>
                  <option value="collection_name">نام کالکشن</option>
                  <option value="surface_finish">نوع سطح (Finish)</option>
                  <option value="body_type">نوع بدنه</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">عبارت مورد نظر برای جستجو (Find):</label>
                <input
                  type="text"
                  required
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="مثال: رویال"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">عبارت جایگزین (Replace With):</label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="مثال: پرسلان رویال"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20"
              >
                جایگزینی متون در ردیف‌ها
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
