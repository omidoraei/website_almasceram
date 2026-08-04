import React, { useState, useEffect } from 'react';
import { Product } from '../../types/tile';
import { Save, Sparkles, CheckSquare, Square, RefreshCw, Image as ImageIcon, Layout } from 'lucide-react';
import { ImageBrowserModal } from './ImageBrowserModal';
import { getHomepageContentByKey, upsertHomepageContent } from '../../lib/api';

interface HomepageContentEditorProps {
  products: Product[];
  onSaveSuccess: () => void;
}

export const HomepageContentEditor: React.FC<HomepageContentEditorProps> = ({
  products,
  onSaveSuccess
}) => {
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_description: '',
    hero_image_url: '',
    about_title: '',
    about_description: '',
    cta_title: '',
    cta_description: '',
    cta_button_text: '',
    featured_product_ids: [] as number[]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isImageBrowserOpen, setIsImageBrowserOpen] = useState(false);

  const fetchHomepageContent = async () => {
    setLoading(true);
    try {
      const data = await getHomepageContentByKey('homepage_settings');
      if (data && data.content_json) {
        const content = data.content_json;
        setFormData({
          hero_title: content.hero_title || '',
          hero_subtitle: content.hero_subtitle || '',
          hero_description: content.hero_description || '',
          hero_image_url: content.hero_image_url || '',
          about_title: content.about_title || '',
          about_description: content.about_description || '',
          cta_title: content.cta_title || '',
          cta_description: content.cta_description || '',
          cta_button_text: content.cta_button_text || '',
          featured_product_ids: Array.isArray(content.featured_product_ids) ? content.featured_product_ids : []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const toggleFeaturedProduct = (productId: number) => {
    setFormData((prev) => {
      const exists = prev.featured_product_ids.includes(productId);
      const newIds = exists
        ? prev.featured_product_ids.filter((id) => id !== productId)
        : [...prev.featured_product_ids, productId];
      return { ...prev, featured_product_ids: newIds };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await upsertHomepageContent('homepage_settings', formData);
      if (result) {
        alert('تنظیمات صفحه اصلی با موفقیت ذخیره شد.');
        onSaveSuccess();
      } else {
        alert('خطا در ذخیره تنظیمات.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در ارتباط با سرور.');
    } finally {
      setSaving(false);
    }
  };

      if (res.ok) {
        alert('محتوای صفحه اصلی با موفقیت بروزرسانی شد.');
        onSaveSuccess();
      } else {
        alert('خطا در ذخیره‌سازی داده‌ها.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در برقراری ارتباط با سرور.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
        در حال لود تنظیمات صفحه اصلی...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs text-right">
      
      {/* 1. Hero Section CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
          <Layout className="w-4 h-4" />
          <span>مدیریت بخش Hero Section (بخش اول صفحه اصلی)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-bold block mb-1">عنوان اصلی Hero:</label>
            <input
              type="text"
              required
              value={formData.hero_title}
              onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">زیرعنوان / نشان فوقانی:</label>
            <input
              type="text"
              value={formData.hero_subtitle}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">متن توضیحات اصلی Hero:</label>
          <textarea
            rows={2}
            value={formData.hero_description}
            onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-300 font-bold block">تصویر اصلی هدر Hero (URL):</label>
            <button
              type="button"
              onClick={() => setIsImageBrowserOpen(true)}
              className="text-amber-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>📷 انتخاب از کتابخانه رسانه‌ای</span>
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="url"
              value={formData.hero_image_url}
              onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 font-mono text-left focus:border-amber-500"
            />
            {formData.hero_image_url && (
              <img src={formData.hero_image_url} alt="Hero Preview" className="w-12 h-10 object-cover rounded-lg border border-slate-800" />
            )}
          </div>
        </div>
      </div>

      {/* 2. About Snippet CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>مدیریت بخش معرفی برند (About Snippet)</span>
        </h3>

        <div>
          <label className="text-slate-300 font-bold block mb-1">عنوان بخش درباره ما:</label>
          <input
            type="text"
            value={formData.about_title}
            onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">توضیحات برند:</label>
          <textarea
            rows={2}
            value={formData.about_description}
            onChange={(e) => setFormData({ ...formData, about_description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. Featured Products Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          <span>انتخاب محصولات شاخص (Featured Products)</span>
        </h3>

        <p className="text-slate-400 text-[11px]">
          محصولاتی که می‌خواهید در ویترین ویژه صفحه اصلی نمایش داده شوند را تیک بزنید ({formData.featured_product_ids.length} مورد انتخاب شده):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {products.map((p) => {
            const isSelected = formData.featured_product_ids.includes(p.id);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => toggleFeaturedProduct(p.id)}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <img src={p.image_url} alt={p.title_fa} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs">{p.title_fa}</div>
                  <div className="text-[10px] text-amber-400 font-mono">کد: {p.code} | {p.size}</div>
                </div>
                {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400 flex-shrink-0" /> : <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Final CTA CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
          <Layout className="w-4 h-4" />
          <span>مدیریت بخش فراخوان نهایی (Final Call-to-Action)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 font-bold block mb-1">عنوان فراخوان:</label>
            <input
              type="text"
              value={formData.cta_title}
              onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">متن روی دکمه اقدام:</label>
            <input
              type="text"
              value={formData.cta_button_text}
              onChange={(e) => setFormData({ ...formData, cta_button_text: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">توضیحات فراخوان:</label>
          <textarea
            rows={2}
            value={formData.cta_description}
            onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-100 focus:border-amber-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? 'در حال ذخیره‌سازی تغییرات...' : 'ذخیره و انتشار تغییرات صفحه اصلی'}</span>
      </button>

      {/* Image Browser Modal */}
      <ImageBrowserModal
        isOpen={isImageBrowserOpen}
        onClose={() => setIsImageBrowserOpen(false)}
        onSelectImage={(url) => setFormData({ ...formData, hero_image_url: url })}
        title="انتخاب تصویر هدر هوم‌پیدج از کتابخانه رسانه‌ای"
      />
    </form>
  );
};
