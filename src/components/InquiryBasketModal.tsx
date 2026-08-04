import React, { useState } from 'react';
import { InquiryItem } from '../types/tile';
import { X, FileText, Send, Trash2, CheckCircle2, Building, Phone, User, MessageSquare } from 'lucide-react';
import { submitInquiry } from '../../lib/api';

interface InquiryBasketModalProps {
  items: InquiryItem[];
  onClose: () => void;
  onRemoveItem: (productId: number) => void;
  onUpdateQuantity: (productId: number, sqm: number) => void;
  onClearAll: () => void;
}

export const InquiryBasketModal: React.FC<InquiryBasketModalProps> = ({
  items,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onClearAll
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalSqm = items.reduce((acc, item) => acc + (item.quantitySqm || 1), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || items.length === 0) return;

    setSubmitting(true);
    try {
      const result = await submitInquiry({
        customer_name: name,
        customer_phone: phone,
        customer_email: null,
        products_json: items.map((i) => ({
          id: i.product.id,
          code: i.product.code,
          title: i.product.title_fa,
          size: i.product.size,
          sqm: i.quantitySqm
        })),
        message: notes || null,
        status: 'pending'
      });

      if (result) {
        setSuccessMessage('درخواست استعلام قیمت شما با موفقیت ثبت شد. کارشناسان فروش ما در اسرع وقت با شما تماس خواهند گرفت.');
        onClearAll();
        setName('');
        setPhone('');
        setCompany('');
        setNotes('');
      } else {
        alert('خطایی در ثبت درخواست رخ داد. لطفاً دوباره تلاش کنید.');
      }
    } catch (err) {
      console.error(err);
      alert('خطای ارتباط با سرور.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white">پیش‌فاكتور و استعلام قیمت پروژه</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {successMessage ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">ثبت موفقیت‌آمیز استعلام قیمت</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">{successMessage}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                بازگشت به کاتالوگ
              </button>
            </div>
          ) : (
            <>
              {/* Selected Tile Items List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>اقلام انتخاب‌شده جهت استعلام ({items.length} کالا):</span>
                  {items.length > 0 && (
                    <button onClick={onClearAll} className="text-red-400 hover:underline flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                      پاکسازی همه
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-dashed border-slate-800">
                    هیچ کاشی یا سرامیکی هنوز انتخاب نشده است. از داخل کاتالوگ گزینه‌های مورد نظر خود را اضافه کنید.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {items.map(({ product, quantitySqm }) => (
                      <div
                        key={product.id}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img src={product.image_url} alt={product.title_fa} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-white">{product.title_fa}</div>
                            <div className="text-amber-400 font-mono text-[10px]">
                              کد: {product.code} | سایز: {product.size} cm
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                            <span className="text-slate-400 text-[10px]">متراژ (مترمربع):</span>
                            <input
                              type="number"
                              min="1"
                              value={quantitySqm}
                              onChange={(e) => onUpdateQuantity(product.id, parseFloat(e.target.value) || 1)}
                              className="w-14 bg-slate-950 text-amber-300 font-mono font-bold text-center rounded border border-slate-800 text-xs py-0.5"
                            />
                          </div>

                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-amber-300">اطلاعات تماس جهت ارسال فاکتور و مشاوره فنی</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">نام و نام خانوادگی / نام پروژه *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: مهندس حسینی"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">شماره همراه تماس *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-500 font-mono text-left focus:border-amber-500"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">نام شرکت / فروشگاه (اختیاری)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="شرکت ساختمانی یا نمایندگی"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
                      />
                      <Building className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">توضیحات و محل پروژه</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="شهر محل تحویل، پروژه مسکونی/تجاری..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pr-9 pl-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500"
                      />
                      <MessageSquare className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'در حال ارسال درخواست...' : 'ارسال استعلام قیمت به کارشناسان الماس سرام'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
