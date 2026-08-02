import React, { useState, useEffect } from 'react';
import { Product, Collection } from '../../types/tile';
import { ProductFormModal } from './ProductFormModal';
import { HomepageContentEditor } from './HomepageContentEditor';
import { BulkImportModal } from './BulkImportModal';
import { BulkEditorSheet } from './BulkEditorSheet';
import { StandardsEditor } from './StandardsEditor';
import { PortfolioEditor } from './PortfolioEditor';
import { 
  Plus, Edit, Trash2, FileText, Layers, Package, ArrowRight, ShieldCheck, 
  RefreshCw, Sparkles, MessageSquare, Layout, Download, Upload, Grid, Building, Award
} from 'lucide-react';

interface AdminDashboardProps {
  onReturnToCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToCatalog }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sheet' | 'homepage' | 'products' | 'standards' | 'portfolio' | 'inquiries' | 'contacts' | 'collections' | 'security'>('overview');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Partial<Product> | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Fetch all Admin Data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [resProd, resInq, resCol, resContact] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/inquiry'),
        fetch('/api/collections'),
        fetch('/api/contact-requests')
      ]);

      if (resProd.ok) setProducts(await resProd.json() || []);
      if (resInq.ok) setInquiries(await resInq.json() || []);
      if (resCol.ok) setCollections(await resCol.json() || []);
      if (resContact.ok) setContacts(await resContact.json() || []);

      const logs = JSON.parse(localStorage.getItem('almas_ceram_sec_logs') || '[]');
      setSecurityLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Export Excel Handler
  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      let exportProducts = products;
      if (!exportProducts || exportProducts.length === 0) {
        const res = await fetch('/api/products');
        if (res.ok) exportProducts = await res.json();
      }

      if (!exportProducts || exportProducts.length === 0) {
        alert('هیچ محصولی در دیتابیس برای خروجی یافت نشد.');
        setExportingExcel(false);
        return;
      }

      let csvContent = '\uFEFF';
      const headers = ['شناسه (ID)','کد کالا (Product Code)','عنوان فارسی','عنوان انگلیسی','عنوان عربی','کد کالکشن','نام کالکشن','ابعاد (Size)','نوع سطح (Surface Finish)','نوع بدنه (Body Type)','تعداد فیس (Faces Count)','ضخامت (Thickness mm)','جذب آب (Water Absorption)','برش لیزری (Rectified)','گروه رنگی','لینک تصویر اصلی','توضیحات فارسی','نمایش ویژه (Featured)'];
      csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\r\n';

      exportProducts.forEach((p) => {
        const row = [p.id||'', p.code||'', p.title_fa||'', p.title_en||'', p.title_ar||'', p.collection_code||'', p.collection_name||'', p.size||'', p.surface_finish||'', p.body_type||'', p.faces_count||1, p.thickness_mm||'', p.water_absorption||'', p.rectified?'بله':'خیر', p.color_family||'', p.image_url||'', (p.description_fa||p.description||'').replace(/\r?\n|\r/g,' '), p.featured?'بله':'خیر'];
        csvContent += row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\r\n';
      });

      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `almas_ceram_products_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`خروجی اکسل با موفقیت دانلود شد (${exportProducts.length} محصول).`);
    } catch (err: any) {
      console.error(err);
      alert('خطا در دانلود اکسل.');
    } finally {
      setExportingExcel(false);
    }
  };

  // Actions
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('آیا از حذف این محصول از دیتابیس اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateInquiryStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/inquiry', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('آیا از حذف این استعلام اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/inquiry?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateContactStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/contact-requests', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/contact-requests?id=${id}`, { method: 'DELETE' });
      if (res.ok) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;
  const newContactsCount = contacts.filter((c) => c.status === 'new').length;
  const totalSqmRequested = inquiries.reduce((acc, inq) => {
    if (Array.isArray(inq.items)) {
      return acc + inq.items.reduce((s: number, it: any) => s + (it.sqm || 1), 0);
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 dir-rtl">
      
      {/* Admin Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">پنل مدیریت جامع الماس سرام</h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40">
                  CMS کامل صفحات، استانداردهای ISO و نمونه‌کارها
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مدیریت محصولات، گواهی‌های ISO، گالری نمونه‌کارها، متون درباره ما و استعلام‌ها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportExcel}
              disabled={exportingExcel}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{exportingExcel ? 'در حال دانلود...' : 'دانلود خروجی اکسل'}</span>
            </button>

            <button
              onClick={loadAdminData}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onReturnToCatalog}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <span>خروج ایمن و بازگشت</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>داشبورد آماری</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>مدیریت محصولات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'standards' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>گواهی‌ها و استانداردها</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'portfolio' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4 text-amber-400" />
            <span>نمونه‌کارها (Portfolio)</span>
          </button>

          <button
            onClick={() => setActiveTab('homepage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'homepage' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>صفحه اصلی و درباره ما (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('sheet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sheet' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>ویرایشگر مستقیم اکسل</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'inquiries' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>استعلام‌ها ({inquiries.length})</span>
            {pendingInquiriesCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {pendingInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'contacts' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>پیام‌های تماس ({contacts.length})</span>
            {newContactsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold">
                {newContactsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'security' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>لاگ‌های امنیتی</span>
          </button>
        </div>

        {/* Tab Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 text-xs block mb-1">کل محصولات کاتالوگ:</span>
                  <span className="text-3xl font-black text-amber-400 font-mono">{products.length}</span>
                </div>
                <button
                  onClick={handleExportExcel}
                  className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود مستقیم اکسل کل محصولات</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-slate-400 text-xs block mb-1">استعلام‌های در انتظار بررسی:</span>
                <span className="text-3xl font-black text-rose-400 font-mono">{pendingInquiriesCount}</span>
                <span className="text-[10px] text-slate-500 block mt-2">نیازمند تماس کارشناس</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-slate-400 text-xs block mb-1">ورودهای امنیتی ثبت‌شده (2FA):</span>
                <span className="text-3xl font-black text-emerald-400 font-mono">{securityLogs.length || 1}</span>
                <span className="text-[10px] text-slate-500 block mt-2">نشست‌های تاییدشده ادمین</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <span className="text-slate-400 text-xs block mb-1">مجموع متراژ درخواستی:</span>
                <span className="text-3xl font-black text-amber-400 font-mono">{totalSqmRequested} m²</span>
                <span className="text-[10px] text-slate-500 block mt-2">ثبت‌شده توسط معماران</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Standards CMS */}
        {activeTab === 'standards' && <StandardsEditor />}

        {/* Tab: Portfolio CMS */}
        {activeTab === 'portfolio' && <PortfolioEditor />}

        {/* Tab: Interactive Sheet Editor */}
        {activeTab === 'sheet' && (
          <BulkEditorSheet
            products={products}
            onSaveSuccess={() => {
              loadAdminData();
            }}
          />
        )}

        {/* Tab Products */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">مدیریت محصولات کاتالوگ و عملیات گروهی Excel</h3>
                <p className="text-xs text-slate-400 mt-0.5">امکان ورود و خروجی گروهی با پیش‌نمایش ۳ مرحله‌ای (Dry-Run)</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsBulkImportOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>ورود گروهی Excel (Dry Run)</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={exportingExcel}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportingExcel ? 'در حال دانلود...' : 'دانلود خروجی Excel'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedProductForEdit(null);
                    setIsProductFormOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن محصول جدید</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3">تصویر</th>
                    <th className="p-3">نام و کد یکتا محصول</th>
                    <th className="p-3">سایز</th>
                    <th className="p-3">نوع سطح</th>
                    <th className="p-3">بدنه</th>
                    <th className="p-3">تعداد فیس</th>
                    <th className="p-3 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-950/50">
                      <td className="p-3">
                        <img src={p.image_url} alt={p.title_fa} className="w-12 h-10 object-cover rounded-lg" />
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-white">{p.title_fa}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold">کد یکتا: {p.code}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-amber-300">{p.size} cm</td>
                      <td className="p-3 text-slate-300">{p.surface_finish}</td>
                      <td className="p-3 text-slate-400 text-[11px]">{p.body_type}</td>
                      <td className="p-3 font-mono text-center">{p.faces_count} فیس</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProductForEdit(p);
                              setIsProductFormOpen(true);
                            }}
                            className="p-1.5 rounded bg-slate-800 text-amber-300 hover:bg-slate-700"
                            title="ویرایش"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Homepage CMS Editor */}
        {activeTab === 'homepage' && (
          <HomepageContentEditor
            products={products}
            onSaveSuccess={() => {
              loadAdminData();
            }}
          />
        )}

        {/* Tab 4: Inquiries Manager */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">لیست درخواست‌های استعلام قیمت مشتریان</h3>

            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                  هیچ استعلامی ثبت نشده است.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-extrabold text-white text-sm">{inq.customer_name}</span>
                        {inq.company && <span className="text-slate-400 mr-2">({inq.company})</span>}
                        <div className="text-amber-400 font-mono text-[11px] mt-0.5">
                          تلفن: {inq.phone}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold"
                        >
                          <option value="pending">در انتظار بررسی</option>
                          <option value="contacted">تماس گرفته شد</option>
                          <option value="completed">تکمیل شده</option>
                        </select>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-2 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 font-bold block mb-1">اقلام استعلام شده:</span>
                      {Array.isArray(inq.items) && inq.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-[11px] text-slate-300">
                          <span>• {item.title} (کد: {item.code})</span>
                          <span className="font-mono text-amber-400 font-bold">{item.sqm || 1} مترمربع</span>
                        </div>
                      ))}
                    </div>

                    {inq.notes && (
                      <p className="text-slate-400 text-[11px]">یادداشت: {inq.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Contact Requests */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">پیام‌های فرم تماس و استعلام مستقیم</h3>

            <div className="space-y-3">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                  پیامی دریافت نشده است.
                </div>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-extrabold text-white text-sm">{c.name}</span>
                        <span className="text-amber-300 mr-2">[{c.subject}]</span>
                        <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                          تلفن: {c.phone} {c.email ? `| ایمیل: ${c.email}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={c.status}
                          onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-bold"
                        >
                          <option value="new">جدید</option>
                          <option value="replied">پاسخ داده شد</option>
                          <option value="archived">آرشیو</option>
                        </select>

                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="p-2 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed font-light">
                      {c.message}
                    </div>

                    {c.product_title && (
                      <div className="text-[11px] text-amber-400 font-mono">
                        مربوط به محصول: {c.product_title} (کد: {c.product_code})
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isProductFormOpen && (
        <ProductFormModal
          product={selectedProductForEdit}
          isOpen={isProductFormOpen}
          onClose={() => setIsProductFormOpen(false)}
          onSaveSuccess={() => {
            loadAdminData();
          }}
        />
      )}

      {/* Bulk Import Modal */}
      {isBulkImportOpen && (
        <BulkImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          onImportSuccess={() => {
            loadAdminData();
          }}
        />
      )}
    </div>
  );
};
