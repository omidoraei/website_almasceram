import React, { useState, useEffect } from 'react';
import { Building, RefreshCw } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchPortfolio = async () => {
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
    fetchPortfolio();
  }, []);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-right dir-rtl">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Building className="w-4 h-4 text-amber-400" />
          <span>گالری پروژه‌های شاخص اجراشده</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          نمونه‌کارهای اجراشده با کاشی الماس سرام
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          نمایش پروژه‌های بزرگ مسکونی، هتلی و تجاری که از پرسلان‌های اسلب و ابعاد استاندارد الماس سرام بهره برده‌اند.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          همه پروژه‌ها ({projects.length})
        </button>
        <button
          onClick={() => setSelectedCategory('residential')}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'residential'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          پروژه‌های مسکونی
        </button>
        <button
          onClick={() => setSelectedCategory('hotel')}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'hotel'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          لابی هتل و تالار
        </button>
        <button
          onClick={() => setSelectedCategory('commercial')}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'commercial'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          تجاری و اداری
        </button>
        <button
          onClick={() => setSelectedCategory('facade')}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'facade'
              ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          نما و فضای باز
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
          در حال دریافت نمونه‌کارها از دیتابیس...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md text-amber-300 font-mono font-bold text-xs px-3 py-1 rounded-full border border-amber-500/30">
                  سایز: {proj.size} cm
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                  <span>{proj.category_fa || proj.category}</span>
                  <span>{proj.location}</span>
                </div>

                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {proj.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">محصول: {proj.tile_used}</span>
                  <span className="text-amber-400 font-bold">{proj.sqm}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
