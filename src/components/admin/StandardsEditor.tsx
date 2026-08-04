import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, ShieldCheck, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { ImageBrowserModal } from './ImageBrowserModal';
import { getStandards, createStandard, updateStandard, deleteStandard } from '../../lib/api';

export const StandardsEditor: React.FC = () => {
  const [standards, setStandards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isImageBrowserOpen, setIsImageBrowserOpen] = useState(false);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const data = await getStandards();
      setStandards(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title_fa) return;

    try {
      let result;
      if (editingItem.id) {
        result = await updateStandard(String(editingItem.id), editingItem);
      } else {
        result = await createStandard(editingItem);
      }

      if (result) {
        alert('استاندارد/گواهینامه با موفقیت ذخیره شد.');
        setEditingItem(null);
        fetchStandards();
      } else {
        alert('خطا در ذخیره استاندارد.');
      }
    } catch (err) {
      console.error(err);
      alert('خطا در ارتباط با سرور.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این گواهینامه اطمینان دارید؟')) return;
    try {
      const success = await deleteStandard(String(id));
      if (success) fetchStandards();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 text-xs text-right dir-rtl">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>مدیریت گواهینامه‌ها و استانداردهای کیفی (با تصویر گواهی)</span>
        </h3>
        <button
          onClick={() => setEditingItem({
            title: '',
            subtitle: 'ISO',
            code: 'ISO-10545',
            description: '',
            status_badge: 'تاییدشده',
            image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
          })}
          className="px-3.5 py-2 bg-amber-500 text-slate-950 font-extrabold rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن گواهی جدید</span>
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-amber-300">{editingItem.id ? 'ویرایش گواهینامه' : 'افزودن گواهینامه جدید'}</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">عنوان اصلی گواهی *</label>
              <input
                type="text"
                required
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                placeholder="مثال: استاندارد بین‌المللی ISO 10545"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">کد یکتا/نشان گواهی</label>
              <input
                type="text"
                value={editingItem.code || ''}
                onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                placeholder="مثال: ISO 10545 CERTIFIED"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-amber-400 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-bold block">تصویر/سند گواهینامه (URL) *</label>
              <button
                type="button"
                onClick={() => setIsImageBrowserOpen(true)}
                className="text-amber-400 font-bold flex items-center gap-1 hover:underline text-[11px]"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>📷 انتخاب از گالری تصاویر</span>
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="url"
                required
                value={editingItem.image_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white font-mono text-left"
              />
              {editingItem.image_url && (
                <img src={editingItem.image_url} alt="Certificate Preview" className="w-12 h-10 object-cover rounded-lg border border-slate-800" />
              )}
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">توضیحات آزمون‌های کیفی</label>
            <textarea
              rows={2}
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="py-2.5 px-5 bg-amber-500 text-slate-950 font-black rounded-xl flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>ذخیره گواهی</span>
            </button>
            <button type="button" onClick={() => setEditingItem(null)} className="py-2.5 px-4 bg-slate-800 text-slate-300 rounded-xl">
              انصراف
            </button>
          </div>
        </form>
      )}

      {/* Standards List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th className="p-3">تصویر گواهی</th>
              <th className="p-3">نشان / کد</th>
              <th className="p-3">عنوان گواهینامه</th>
              <th className="p-3">توضیحات</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {standards.map((st) => (
              <tr key={st.id} className="hover:bg-slate-950/50">
                <td className="p-2">
                  <img src={st.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'} alt={st.title} className="w-12 h-10 object-cover rounded-lg border border-slate-800" />
                </td>
                <td className="p-3 font-mono font-bold text-amber-400">{st.code}</td>
                <td className="p-3 font-bold text-white">{st.title}</td>
                <td className="p-3 text-slate-300 text-[11px] leading-relaxed">{st.description}</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setEditingItem(st)} className="p-1.5 rounded bg-slate-800 text-amber-300">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(st.id)} className="p-1.5 rounded bg-slate-800 text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Browser Modal */}
      <ImageBrowserModal
        isOpen={isImageBrowserOpen}
        onClose={() => setIsImageBrowserOpen(false)}
        onSelectImage={(url) => editingItem && setEditingItem({ ...editingItem, image_url: url })}
        title="انتخاب تصویر/سند گواهینامه از گالری"
      />
    </div>
  );
};
