import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Building, Image as ImageIcon } from 'lucide-react';
import { ImageBrowserModal } from './ImageBrowserModal';

export const PortfolioEditor: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProj, setEditingProj] = useState<any | null>(null);
  const [isImageBrowserOpen, setIsImageBrowserOpen] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) setProjects(await res.json() || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj?.title || !editingProj?.image) return;

    try {
      const method = editingProj.id ? 'PUT' : 'POST';
      const res = await fetch('/api/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProj)
      });

      if (res.ok) {
        alert('پروژه نمونه‌کار با موفقیت ذخیره شد.');
        setEditingProj(null);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این پروژه نمونه‌کار اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-xs text-right dir-rtl">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-400" />
          <span>مدیریت گالری نمونه‌کارهای اجراشده (Portfolio)</span>
        </h3>
        <button
          onClick={() => setEditingProj({
            title: '',
            category: 'residential',
            category_fa: 'پروژه مسکونی لوکس',
            location: 'تهران',
            tile_used: 'پرسلان اسلب ۱۰۰x۱۰۰ اونیکس رویال',
            size: '100x100',
            sqm: '۱۰۰۰ مترمربع',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            description: ''
          })}
          className="px-3.5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن نمونه‌کار جدید</span>
        </button>
      </div>

      {editingProj && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-amber-300">{editingProj.id ? 'ویرایش پروژه' : 'افزودن نمونه‌کار جدید'}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">عنوان پروژه *</label>
              <input
                type="text"
                required
                value={editingProj.title || ''}
                onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                placeholder="مثال: برج مسکونی فرشته تهران"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">دسته‌بندی کاربری</label>
              <select
                value={editingProj.category || 'residential'}
                onChange={(e) => {
                  const cat = e.target.value;
                  const catFa = cat === 'residential' ? 'پروژه مسکونی' : cat === 'hotel' ? 'لابی هتل' : cat === 'commercial' ? 'تجاری اداری' : 'نما و فضای باز';
                  setEditingProj({ ...editingProj, category: cat, category_fa: catFa });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-amber-300 font-bold"
              >
                <option value="residential">مسکونی</option>
                <option value="hotel">لابی هتل و تالار</option>
                <option value="commercial">تجاری و اداری</option>
                <option value="facade">نما و فضای باز</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">موقعیت/شهر</label>
              <input
                type="text"
                value={editingProj.location || ''}
                onChange={(e) => setEditingProj({ ...editingProj, location: e.target.value })}
                placeholder="تهران، فرشته"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">کاشی/پرسلان استفاده‌شده</label>
              <input
                type="text"
                value={editingProj.tile_used || ''}
                onChange={(e) => setEditingProj({ ...editingProj, tile_used: e.target.value })}
                placeholder="پرسلان اسلب ۱۰۰x۱۰۰ اونیکس"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">متراژ کارشده (m²)</label>
              <input
                type="text"
                value={editingProj.sqm || ''}
                onChange={(e) => setEditingProj({ ...editingProj, sqm: e.target.value })}
                placeholder="۱۲۰۰ مترمربع"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-bold block">لینک تصویر اصلی پروژه (URL) *</label>
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
                value={editingProj.image || ''}
                onChange={(e) => setEditingProj({ ...editingProj, image: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-mono text-left"
              />
              {editingProj.image && (
                <img src={editingProj.image} alt="Preview" className="w-12 h-10 object-cover rounded-lg border border-slate-800" />
              )}
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">توضیحات پروژه</label>
            <textarea
              rows={2}
              value={editingProj.description || ''}
              onChange={(e) => setEditingProj({ ...editingProj, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="py-2.5 px-5 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>ذخیره پروژه</span>
            </button>
            <button type="button" onClick={() => setEditingProj(null)} className="py-2.5 px-4 bg-slate-800 text-slate-300 rounded-xl">
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-4">
            <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded-xl" />
            <div className="space-y-1 text-xs flex-1">
              <div className="font-extrabold text-white">{p.title}</div>
              <div className="text-amber-400 font-mono text-[10px]">{p.category_fa} | {p.location}</div>
              <p className="text-slate-400 text-[11px] line-clamp-1">{p.description}</p>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setEditingProj(p)} className="p-1 bg-slate-800 text-amber-300 rounded">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-1 bg-slate-800 text-rose-400 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Browser Modal */}
      <ImageBrowserModal
        isOpen={isImageBrowserOpen}
        onClose={() => setIsImageBrowserOpen(false)}
        onSelectImage={(url) => editingProj && setEditingProj({ ...editingProj, image: url })}
        title="انتخاب تصویر پروژه نمونه‌کار از گالری"
      />
    </div>
  );
};
