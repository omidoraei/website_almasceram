import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, AlertOctagon, RefreshCw, FileText, ArrowRight, RotateCcw, Eye, ShieldCheck, CheckSquare } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'upload' | 'preview' | 'history'>('upload');
  const [fileText, setFileText] = useState('');
  const [filename, setFilename] = useState('almas_ceram_import.csv');

  const [previewData, setPreviewData] = useState<any | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [rollingBackId, setRollingBackId] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setFileText(text || '');
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Step 1 -> Step 2: Request Preview (Dry Run)
  const handleRequestPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileText.trim()) return;

    setLoadingPreview(true);
    try {
      const res = await fetch('/api/import-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: fileText, filename })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در اعتبارسنجی فایل');

      setPreviewData(data);
      setStep('preview');
    } catch (err: any) {
      alert(err.message || 'خطا در پردازش فایل');
    } finally {
      setLoadingPreview(false);
    }
  };

  // Step 2 -> Step 3: Commit Approved Changes
  const handleCommitImport = async () => {
    if (!previewData || !previewData.rows) return;

    setCommitting(true);
    try {
      const res = await fetch('/api/import-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: previewData.rows,
          filename: previewData.summary.filename,
          adminUser: 'admin@almasceram.com'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت نهایی تغییرات');

      alert(data.message || 'تغییرات با موفقیت اعمال شد.');
      onImportSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت تغییرات');
    } finally {
      setCommitting(false);
    }
  };

  // Rollback Action
  const handleRollback = async (importId: number) => {
    if (!confirm('آیا از بازگردانی (Rollback) این عملیات اطمینان دارید؟ تمام محصولات ساخته‌شده حذف و محصولات تغییریافته به وضعیت قبل بازمی‌گردند.')) return;

    setRollingBackId(importId);
    try {
      const res = await fetch('/api/import-rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ importId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در بازگردانی');

      alert(data.message || 'عملیات با موفقیت بازگردانی شد.');
      onImportSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در بازگردانی');
    } finally {
      setRollingBackId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto dir-rtl text-right">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">
              سیستم ۳ مرحله‌ای واردسازی و ویرایش گروهی محصولات (Bulk Import & Dry-Run)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Steps Indicator */}
        <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 ${step === 'upload' ? 'text-amber-400 font-black' : ''}`}>
              ۱. آپلود فایل Excel/CSV
            </span>
            <span>&gt;</span>
            <span className={`flex items-center gap-1 ${step === 'preview' ? 'text-amber-400 font-black' : ''}`}>
              ۲. پیش‌نمایش و اعتبارسنجی (Dry Run)
            </span>
          </div>

          <button
            onClick={() => setStep(step === 'history' ? 'upload' : 'history')}
            className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{step === 'history' ? 'بازگشت به آپلود' : 'مشاهده سوابق Import & Rollback'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* STEP 1: UPLOAD FILE FORM */}
          {step === 'upload' && (
            <form onSubmit={handleRequestPreview} className="space-y-5">
              <div className="p-8 bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/30 text-center space-y-3">
                <Upload className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">آپلود فایل Excel (.xlsx / .csv) کاتالوگ محصولات</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  فایل اکسل خروجی‌گرفته‌شده از فاز ۶.۱ را انتخاب کنید یا متون ردیف‌های CSV را در کادر زیر وارد کنید.
                </p>

                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="block mx-auto text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">یا محتوای متنی CSV فایل را مستقیماً وارد کنید:</label>
                <textarea
                  rows={5}
                  value={fileText}
                  onChange={(e) => setFileText(e.target.value)}
                  placeholder="Paste CSV text content here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-200 text-[11px] dir-ltr text-left focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPreview || !fileText.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>{loadingPreview ? 'در حال اعتبارسنجی (Dry-Run)...' : 'پردازش و پیش‌نمایش تغییرات (Step 2)'}</span>
              </button>
            </form>
          )}

          {/* STEP 2: PREVIEW DRY-RUN TABLE */}
          {step === 'preview' && previewData && (
            <div className="space-y-5">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">کل ردیف‌ها:</span>
                  <span className="text-lg font-black text-white font-mono">{previewData.summary.totalRows}</span>
                </div>
                <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40">
                  <span className="text-emerald-400 text-[11px] block font-bold">محصولات جدید (NEW):</span>
                  <span className="text-lg font-black text-emerald-300 font-mono">{previewData.summary.newCount}</span>
                </div>
                <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/40">
                  <span className="text-amber-400 text-[11px] block font-bold">به‌روزرسانی (UPDATE):</span>
                  <span className="text-lg font-black text-amber-300 font-mono">{previewData.summary.updateCount}</span>
                </div>
                <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-500/40">
                  <span className="text-rose-400 text-[11px] block font-bold">خطادار (INVALID):</span>
                  <span className="text-lg font-black text-rose-300 font-mono">{previewData.summary.invalidCount}</span>
                </div>
              </div>

              {/* Preview Rows Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-72">
                <table className="w-full text-[11px] text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <th className="p-2.5">ردیف</th>
                      <th className="p-2.5">وضعیت</th>
                      <th className="p-2.5">کد کالا</th>
                      <th className="p-2.5">عنوان</th>
                      <th className="p-2.5">تغییرات (Before &gt; After) / خطاها</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {previewData.rows.map((r: any) => (
                      <tr key={r.rowNumber} className="hover:bg-slate-900/50">
                        <td className="p-2.5">{r.rowNumber}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'NEW'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : r.status === 'UPDATE'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-amber-300">{r.code}</td>
                        <td className="p-2.5 text-slate-200 font-sans">{r.title_fa}</td>
                        <td className="p-2.5">
                          {r.errors && r.errors.length > 0 ? (
                            <span className="text-rose-400 font-sans">{r.errors.join('، ')}</span>
                          ) : r.diffs && r.diffs.length > 0 ? (
                            <div className="space-y-0.5 text-[10px]">
                              {r.diffs.map((d: any, i: number) => (
                                <div key={i} className="text-slate-300">
                                  • {d.field}: <span className="text-rose-400 line-through">{d.oldValue}</span> &gt; <span className="text-emerald-400 font-bold">{d.newValue}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500">بدون تغییر</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('upload')}
                  className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  بازگشت و اصلاح فایل
                </button>

                <button
                  onClick={handleCommitImport}
                  disabled={committing || !previewData.summary.canCommit}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{committing ? 'در حال اعمال تغییرات...' : 'تایید نهایی و اعمال گروهی در دیتابیس (Step 3)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IMPORT HISTORY & ROLLBACK */}
          {step === 'history' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs">سوابق واردسازی‌های قبلی و امکان بازگردانی (Rollback)</h4>
              
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-300 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">فایل: almas_ceram_import_v1.csv</span>
                    <span className="text-amber-400 font-mono text-[10px] mr-2">(۲ محصول جدید، ۳ بروزرسانی)</span>
                  </div>
                  <button
                    onClick={() => handleRollback(1)}
                    disabled={rollingBackId === 1}
                    className="py-1.5 px-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[11px] flex items-center gap-1 hover:bg-rose-500/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{rollingBackId === 1 ? 'در حال Rollback...' : 'بازگردانی آخرین Import'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
