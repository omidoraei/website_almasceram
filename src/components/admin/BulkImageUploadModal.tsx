import React, { useState } from 'react';
import { X, Upload, Image, CheckCircle2, AlertOctagon, RefreshCw, FileText, ArrowRight, ShieldCheck, CheckSquare, Search } from 'lucide-react';

interface BulkImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const BulkImageUploadModal: React.FC<BulkImageUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ name: string; type: string; base64: string }[]>([]);

  const [previewReport, setPreviewData] = useState<any | null>(null);
  const [manualAssociations, setManualAssociations] = useState<Map<string, { productId: number; imageType: string }>>(new Map());

  const [processing, setProcessing] = useState(false);
  const [committing, setCommitting] = useState(false);

  // Handle Multi-file Selection
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles(files);

    // Read base64 previews
    const previewPromises = files.map((file) => {
      return new Promise<{ name: string; type: string; base64: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          resolve({
            name: file.name,
            type: file.type || 'image/jpeg',
            base64: evt.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((results) => {
      setFilePreviews(results);
    });
  };

  // Step 1 -> Step 2: Dry Run Preview Request
  const handleRequestPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (filePreviews.length === 0) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/bulk-upload-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filePreviews })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در اعتبارسنجی تصاویر');

      setPreviewData(data);
      setStep('preview');
    } catch (err: any) {
      alert(err.message || 'خطا در پردازش تصاویر');
    } finally {
      setProcessing(false);
    }
  };

  // Manual Association Setter for Unmatched Images
  const handleSetManualAssociation = (fileName: string, productId: number, imageType: string) => {
    setManualAssociations((prev) => {
      const newMap = new Map(prev);
      newMap.set(fileName, { productId, imageType });
      return newMap;
    });
  };

  // Commit Image Uploads to Supabase Database
  const handleCommitUpload = async () => {
    if (!previewReport) return;

    setCommitting(true);
    try {
      // Consolidate Matched + Manually Associated Unmatched Items
      const itemsToCommit: any[] = [];

      // Matched Items
      (previewReport.matched || []).forEach((m: any) => {
        itemsToCommit.push({
          productId: m.productId,
          imageType: m.imageType,
          previewUrl: m.previewUrl
        });
      });

      // Unmatched Items that were manually associated by admin
      (previewReport.unmatched || []).forEach((u: any) => {
        const manual = manualAssociations.get(u.fileName);
        if (manual && manual.productId) {
          itemsToCommit.push({
            productId: manual.productId,
            imageType: manual.imageType || 'main',
            previewUrl: u.previewUrl
          });
        }
      });

      if (itemsToCommit.length === 0) {
        alert('هیچ تصویر تطبیق‌یافته‌ای برای ثبت انتخاب نشده است.');
        setCommitting(false);
        return;
      }

      const res = await fetch('/api/bulk-upload-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToCommit })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ذخیره‌سازی تصاویر');

      alert(data.message || 'تصاویر با موفقیت آپلود و گالری بروزرسانی شد.');
      onUploadSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در برقراری ارتباط با سرور');
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto dir-rtl text-right">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">
              آپلود و تطبیق خودکار گروهی تصاویر محصولات (Bulk Image Upload)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* STEP 1: UPLOAD FILE FORM & NAMING CONVENTION */}
          {step === 'upload' && (
            <form onSubmit={handleRequestPreview} className="space-y-5">
              
              {/* Naming Convention Guide Card */}
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-2">
                <span className="text-amber-300 font-bold block text-xs">
                  💡 الگوی استاندارد نام‌گذاری تصاویر برای تطبیق خودکار (Convention):
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] font-mono leading-relaxed">
                  <li>عکس اصلی محصول: <strong className="text-amber-400">کد_محصول.jpg</strong> (مثال: <code className="bg-slate-950 px-1 rounded">ALM-60120-01.jpg</code>)</li>
                  <li>فیس‌های متغیر کاشی: <strong className="text-amber-400">کد_محصول_face1.jpg</strong> (مثال: <code className="bg-slate-950 px-1 rounded">ALM-60120-01_face1.jpg</code>)</li>
                  <li>رندر دکوراسیون داخلی: <strong className="text-amber-400">کد_محصول_room.jpg</strong> (مثال: <code className="bg-slate-950 px-1 rounded">ALM-60120-01_room.jpg</code>)</li>
                </ul>
              </div>

              {/* Upload Drop Zone */}
              <div className="p-8 bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/30 text-center space-y-3">
                <Upload className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">انتخاب چند فایل تصویری همزمان (JPG, PNG, WEBP)</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  حداکثر ۱۰ مگابایت برای هر تصویر. تصاویر بر اساس کد محصول تشخیص داده می‌شوند.
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFilesSelected}
                  className="block mx-auto text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />

                {filePreviews.length > 0 && (
                  <div className="text-amber-300 font-mono font-bold text-xs pt-2">
                    {filePreviews.length} فایل تصویری انتخاب شده است.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing || filePreviews.length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{processing ? 'در حال انطباق تصاویر...' : 'پردازش و انطباق خودکار با محصولات'}</span>
              </button>
            </form>
          )}

          {/* STEP 2: DRY-RUN PREVIEW TABLE & UNMATCHED MANUAL ASSOCIATION */}
          {step === 'preview' && previewReport && (
            <div className="space-y-6">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">کل تصاویر:</span>
                  <span className="text-lg font-black text-white font-mono">{previewReport.summary.totalFiles}</span>
                </div>
                <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/40">
                  <span className="text-emerald-400 text-[11px] block font-bold">تطبیق‌یافته اتوماتیک:</span>
                  <span className="text-lg font-black text-emerald-300 font-mono">{previewReport.summary.matchedCount}</span>
                </div>
                <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/40">
                  <span className="text-amber-400 text-[11px] block font-bold">بدون تطبیق اتوماتیک:</span>
                  <span className="text-lg font-black text-amber-300 font-mono">{previewReport.summary.unmatchedCount}</span>
                </div>
              </div>

              {/* Matched Images List */}
              {previewReport.matched && previewReport.matched.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-400 text-xs">۱. تصاویر تطبیق‌یافته خودکار با محصولات:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {previewReport.matched.map((m: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={m.previewUrl} alt={m.fileName} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{m.productTitle}</div>
                            <div className="text-amber-400 font-mono text-[10px]">
                              کد: {m.code} | نوع: {m.imageType}
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unmatched Images List with Manual Selection Dropdown */}
              {previewReport.unmatched && previewReport.unmatched.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="font-bold text-amber-300 text-xs">۲. تصاویر بدون تطبیق اتوماتیک (انتخاب دستی محصول):</h4>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {previewReport.unmatched.map((u: any, idx: number) => {
                      const manual = manualAssociations.get(u.fileName);
                      return (
                        <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={u.previewUrl} alt={u.fileName} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <div className="font-bold text-slate-200">{u.fileName}</div>
                              <span className="text-slate-500 text-[10px]">نام فایل با کدی تطبیق پیدا نکرد</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select
                              value={manual?.productId || ''}
                              onChange={(e) => handleSetManualAssociation(u.fileName, parseInt(e.target.value, 10), manual?.imageType || 'main')}
                              className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-xs text-amber-300 font-bold focus:border-amber-500 flex-1 sm:w-48"
                            >
                              <option value="">اتصال دستی به محصول...</option>
                              {(previewReport.allProducts || []).map((p: any) => (
                                <option key={p.id} value={p.id}>
                                  {p.title_fa} ({p.code})
                                </option>
                              ))}
                            </select>

                            <select
                              value={manual?.imageType || 'main'}
                              onChange={(e) => handleSetManualAssociation(u.fileName, manual?.productId || 0, e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-2 text-xs text-slate-200"
                            >
                              <option value="main">تصویر اصلی</option>
                              <option value="face">فیس متغیر</option>
                              <option value="ambiance">رندر محیطی</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('upload')}
                  className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  بازگشت
                </button>

                <button
                  onClick={handleCommitUpload}
                  disabled={committing}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{committing ? 'در حال ذخیره‌سازی تصاویر...' : 'تایید و بروزرسانی گالری کاشی‌ها'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
