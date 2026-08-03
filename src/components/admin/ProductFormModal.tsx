import React, { useState } from 'react';
import { Product } from '../../types/tile';
import { X, Save, Layers, Globe, Image as ImageIcon } from 'lucide-react';
import { ImageBrowserModal } from './ImageBrowserModal';

interface ProductFormModalProps {
  product: Partial<Product> | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const MANDATORY_SIZES = ['30x30', '40x40', '60x60', '60x120', '80x80', '100x100', '30x90'];
const FINISHES = ['پولیش (Polished)', 'مات (Matt)', 'کاروینگ (Carving)', 'شوگر (Sugar)', 'براق (Glossy)', 'لاپاتو (Lappato)'];
const BODY_TYPES = ['پرسلان فول بادی (Full Body Porcelain)', 'پرسلان لعابدار (Glazed Porcelain)', 'سرامیک بدنه سفید (White Body)'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveSuccess
}) => {
  if (!isOpen) return null;

  const isEditing = !!product?.id;
  const [activeLangTab, setActiveLangTab] = useState<'fa' | 'en' | 'ar'>('fa');
  const [isImageBrowserOpen, setIsImageBrowserOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    title_fa: product?.title_fa || '',
    title_en: product?.title_en || '',
    title_ar: product?.title_ar || '',
    code: product?.code || `ALM-${Math.floor(1000 + Math.random() * 9000)}`,
    collection_code: product?.collection_code || 'ONYX_ROYAL',
    collection_name: product?.collection_name || 'کالکشن اونیکس رویال',
    size: product?.size || '60x120',
    surface_finish: product?.surface_finish || 'پولیش (Polished)',
    body_type: product?.body_type || 'پرسلان فول بادی (Full Body Porcelain)',
    faces_count: product?.faces_count || 8,
    thickness_mm: product?.thickness_mm || 11.5,
    water_absorption: product?.water_absorption || '< 0.1% ISO 10545-3',
    rectified: product?.rectified ?? true,
    applications: product?.applications || ['کف سالن', 'لابی هتل'],
    color_family: product?.color_family || 'سفید و مرمر (White/Marble)',
    image_url: product?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    face_images: product?.face_images || [],
    ambiance_images: product?.ambiance_images || [],
    description: product?.description || '',
    description_fa: product?.description_fa || product?.description || '',
    description_en: product?.description_en || '',
    description_ar: product?.description_ar || '',
    featured: product?.featured ?? false
  });

  const [activeImageTab, setActiveImageTab] = useState<'main' | 'faces' | 'ambiance'>('main');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = '/api/products';
      const method = isEditing ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        description: formData.description_fa || formData.description || ''
      };
      const body = isEditing ? { id: product.id, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'خطا در ثبت محصول');
      }

      onSaveSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'خطا در برقراری ارتباط');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto dir-rtl">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">
              {isEditing ? `ویرایش محصول (کد: ${product.code})` : 'افزودن محصول جدید به کاتالوگ الماس سرام'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Multi-lingual Tabs for Title & Description */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>تنظیمات زبان متون محصول (Multi-Language CMS):</span>
              </span>

              {/* Language Tabs Selector */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 font-bold">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('fa')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeLangTab === 'fa' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇮🇷 فارسی (اصلی)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeLangTab === 'en' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ar')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeLangTab === 'ar' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇸🇦 العربية
                </button>
              </div>
            </div>

            {/* Language Specific Fields */}
            {activeLangTab === 'fa' && (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">نام محصول به فارسی *</label>
                  <input
                    type="text"
                    required
                    value={formData.title_fa || ''}
                    onChange={(e) => setFormData({ ...formData, title_fa: e.target.value })}
                    placeholder="مثال: پرسلان اونیکس رویال ۶۰x۱۲۰ سوپر پولیش"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">توضیحات محصول به فارسی</label>
                  <textarea
                    rows={3}
                    value={formData.description_fa || formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description_fa: e.target.value, description: e.target.value })}
                    placeholder="توضیحات معمارانه فارسی..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'en' && (
              <div className="space-y-3 text-left dir-ltr font-mono">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Title (English)</label>
                  <input
                    type="text"
                    value={formData.title_en || ''}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    placeholder="e.g. Onyx Royal Super Polished Porcelain 60x120"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Description (English)</label>
                  <textarea
                    rows={3}
                    value={formData.description_en || ''}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Architectural English product description..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {activeLangTab === 'ar' && (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم المنتج باللغة العربية</label>
                  <input
                    type="text"
                    value={formData.title_ar || ''}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    placeholder="مثال: بلاط بورسلين أونيكس رويال ٦۰x۱۲۰ سوپر بولیش"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">وصف المنتج باللغة العربية</label>
                  <textarea
                    rows={3}
                    value={formData.description_ar || ''}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    placeholder="الوصف المعماري باللغة العربية..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Code & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">کد اختصاصی محصول *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="مثال: ALM-60120-09"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-amber-300 font-bold block mb-1">سایز محصول (CM) *</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                className="w-full bg-slate-950 border border-amber-500/40 rounded-xl py-2 px-3 text-amber-300 font-mono font-bold focus:border-amber-500"
              >
                {MANDATORY_SIZES.map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">نوع سطح (Finish) *</label>
              <select
                value={formData.surface_finish}
                onChange={(e) => setFormData({ ...formData, surface_finish: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
              >
                {FINISHES.map((fn) => (
                  <option key={fn} value={fn}>{fn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">نوع بدنه (Body) *</label>
              <select
                value={formData.body_type}
                onChange={(e) => setFormData({ ...formData, body_type: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
              >
                {BODY_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 font-bold block mb-1">تعداد فیس متغیر</label>
              <input
                type="number"
                min="1"
                max="32"
                value={formData.faces_count}
                onChange={(e) => setFormData({ ...formData, faces_count: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">ضخامت (میلی‌متر)</label>
              <input
                type="number"
                step="0.5"
                value={formData.thickness_mm}
                onChange={(e) => setFormData({ ...formData, thickness_mm: parseFloat(e.target.value) || 10 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">نام کالکشن</label>
              <input
                type="text"
                value={formData.collection_name}
                onChange={(e) => setFormData({ ...formData, collection_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Image Management Section with Tabs */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>مدیریت تصاویر محصول:</span>
              </span>

              {/* Image Type Tabs */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 font-bold text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveImageTab('main')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeImageTab === 'main' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🖼️ تصویر اصلی
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab('faces')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeImageTab === 'faces' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📐 فیس‌های متغیر ({formData.face_images?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageTab('ambiance')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeImageTab === 'ambiance' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏠 فضای اجرا ({formData.ambiance_images?.length || 0})
                </button>
              </div>
            </div>

            {/* Main Image Tab */}
            {activeImageTab === 'main' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold block">لینک تصویر اصلی محصول (URL) *</label>
                  <button
                    type="button"
                    onClick={() => setIsImageBrowserOpen(true)}
                    className="text-amber-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>📷 انتخاب از کتابخانه تصاویر</span>
                  </button>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
                  />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-amber-500/40 shadow-lg" />
                  )}
                </div>
              </div>
            )}

            {/* Faces Images Tab */}
            {activeImageTab === 'faces' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold block">تصاویر فیس‌های متغیر (حداکثر {formData.faces_count} عدد)</label>
                  <button
                    type="button"
                    onClick={() => setIsImageBrowserOpen(true)}
                    className="text-amber-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ افزودن فیس جدید</span>
                  </button>
                </div>

                {formData.face_images && formData.face_images.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {formData.face_images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Face ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border border-slate-700" />
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, face_images: formData.face_images?.filter((_, i) => i !== idx) || [] })}
                            className="p-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 text-center mt-1 block">فیس {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsImageBrowserOpen(true)}
                    className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">برای افزودن تصاویر فیس کلیک کنید</p>
                    <p className="text-slate-500 text-[10px] mt-1">تعداد فیس تعریف شده: {formData.faces_count}</p>
                  </div>
                )}
              </div>
            )}

            {/* Ambiance Images Tab */}
            {activeImageTab === 'ambiance' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-bold block">تصاویر فضای اجرا (نمونه کارهای نصب شده)</label>
                  <button
                    type="button"
                    onClick={() => setIsImageBrowserOpen(true)}
                    className="text-amber-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ افزودن تصویر فضا</span>
                  </button>
                </div>

                {formData.ambiance_images && formData.ambiance_images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {formData.ambiance_images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Ambiance ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border border-slate-700" />
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, ambiance_images: formData.ambiance_images?.filter((_, i) => i !== idx) || [] })}
                            className="p-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsImageBrowserOpen(true)}
                    className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400 text-xs">برای افزودن تصاویر فضای اجرا کلیک کنید</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredCheck"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 focus:ring-amber-500"
            />
            <label htmlFor="featuredCheck" className="text-amber-300 font-bold cursor-pointer">
              نمایش ویژه در صفحه اصلی (Featured Product)
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'در حال ذخیره‌سازی...' : isEditing ? 'ذخیره تغییرات محصول' : 'انتشار محصول جدید در کاتالوگ'}</span>
          </button>
        </form>
      </div>

      {/* Image Browser Modal */}
      <ImageBrowserModal
        isOpen={isImageBrowserOpen}
        onClose={() => setIsImageBrowserOpen(false)}
        onSelectImage={(url) => {
          if (activeImageTab === 'faces') {
            setFormData({ ...formData, face_images: [...(formData.face_images || []), url] });
          } else if (activeImageTab === 'ambiance') {
            setFormData({ ...formData, ambiance_images: [...(formData.ambiance_images || []), url] });
          } else {
            setFormData({ ...formData, image_url: url });
          }
        }}
        title={
          activeImageTab === 'faces' 
            ? 'انتخاب تصویر فیس جدید از کتابخانه رسانه‌ای کارخانه' 
            : activeImageTab === 'ambiance'
            ? 'انتخاب تصویر فضای اجرا از کتابخانه رسانه‌ای کارخانه'
            : 'انتخاب تصویر محصول از کتابخانه رسانه‌ای کارخانه'
        }
      />
    </div>
  );
};
